#!/bin/bash

# Cryptus Zero Downtime Deployment Configuration
# This file configures the zero-downtime library for Cryptus project

# Source the zero downtime library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/zero-downtime-library/lib/zero-downtime-lib.sh"

# ========================================
# PROJECT CONFIGURATION
# ========================================

# Docker Compose configuration
ZDT_COMPOSE_FILE="docker-compose.zero-downtime.yml"
ZDT_COMPOSE_PROFILE="blue-green"

# Container names
ZDT_BLUE_CONTAINER="secret-blue"
ZDT_GREEN_CONTAINER="secret-green"
ZDT_MAIN_CONTAINER="secret"

# Service names
ZDT_BLUE_SERVICE="secret-blue"
ZDT_GREEN_SERVICE="secret-green"
ZDT_MAIN_SERVICE="secret"

# Network configuration
ZDT_NETWORK_NAME="coex-tma"
ZDT_APP_PORT="3000"
ZDT_NGINX_PORT="80"

# Health check configuration
ZDT_HEALTH_ENDPOINT="/api/health"
ZDT_NGINX_HEALTH_ENDPOINT="/nginx-health"
ZDT_EXTERNAL_HEALTH_URL="https://secret-front-preview.partners-bot.ru/api/health"

# Nginx configuration
ZDT_NGINX_CONFIG_DIR="./nginx"
ZDT_NGINX_MAIN_CONFIG="$ZDT_NGINX_CONFIG_DIR/nginx.conf"
ZDT_NGINX_BLUE_CONFIG="$ZDT_NGINX_CONFIG_DIR/nginx-blue.conf"
ZDT_NGINX_GREEN_CONFIG="$ZDT_NGINX_CONFIG_DIR/nginx-green.conf"

# Timeouts and intervals
ZDT_MAX_HEALTH_ATTEMPTS=30
ZDT_HEALTH_CHECK_INTERVAL=5
ZDT_TRAFFIC_SWITCH_TIMEOUT=30

# ========================================
# DEPLOYMENT FUNCTIONS
# ========================================

cryptus_deploy_blue() {
    local instance=$1
    local custom_args=$2
    
    zdt_log_info "Deploying blue instance with Docker Compose..."
    
    # Stop old instance
    docker compose -f "$ZDT_COMPOSE_FILE" stop "$ZDT_BLUE_SERVICE" 2>/dev/null || true
    
    # Build and start new instance
    if ! docker compose -f "$ZDT_COMPOSE_FILE" --profile "$ZDT_COMPOSE_PROFILE" build "$ZDT_BLUE_SERVICE"; then
        zdt_log_error "Failed to build blue service"
        return 1
    fi
    
    if ! docker compose -f "$ZDT_COMPOSE_FILE" --profile "$ZDT_COMPOSE_PROFILE" up -d "$ZDT_BLUE_SERVICE"; then
        zdt_log_error "Failed to start blue service"
        return 1
    fi
    
    zdt_log_success "Blue instance deployed"
    return 0
}

cryptus_deploy_green() {
    local instance=$1
    local custom_args=$2
    
    zdt_log_info "Deploying green instance with Docker Compose..."
    
    # Stop old instance
    docker compose -f "$ZDT_COMPOSE_FILE" stop "$ZDT_GREEN_SERVICE" 2>/dev/null || true
    
    # Build and start new instance
    if ! docker compose -f "$ZDT_COMPOSE_FILE" --profile "$ZDT_COMPOSE_PROFILE" build "$ZDT_GREEN_SERVICE"; then
        zdt_log_error "Failed to build green service"
        return 1
    fi
    
    if ! docker compose -f "$ZDT_COMPOSE_FILE" --profile "$ZDT_COMPOSE_PROFILE" up -d "$ZDT_GREEN_SERVICE"; then
        zdt_log_error "Failed to start green service"
        return 1
    fi
    
    zdt_log_success "Green instance deployed"
    return 0
}

cryptus_switch_traffic() {
    local target_instance=$1
    
    zdt_log_info "Switching traffic to $target_instance via nginx configuration..."
    
    # Determine source config file
    local source_config=""
    if [ "$target_instance" = "blue" ]; then
        source_config="$ZDT_NGINX_BLUE_CONFIG"
    else
        source_config="$ZDT_NGINX_GREEN_CONFIG"
    fi
    
    if [ ! -f "$source_config" ]; then
        zdt_log_error "Configuration file not found: $source_config"
        return 1
    fi
    
    # Backup current config
    cp "$ZDT_NGINX_MAIN_CONFIG" "${ZDT_NGINX_MAIN_CONFIG}.backup" || {
        zdt_log_error "Failed to backup nginx configuration"
        return 1
    }
    
    # Copy new configuration
    cp "$source_config" "$ZDT_NGINX_MAIN_CONFIG" || {
        zdt_log_error "Failed to copy new nginx configuration"
        return 1
    }
    
    # Reload nginx configuration
    if ! docker ps --format "table {{.Names}}" | grep -q "^$ZDT_MAIN_CONTAINER$"; then
        zdt_log_error "Main nginx container not found or not running"
        # Restore backup
        cp "${ZDT_NGINX_MAIN_CONFIG}.backup" "$ZDT_NGINX_MAIN_CONFIG"
        return 1
    fi
    
    # Instead of nginx reload, restart the container for more reliable config update
    if ! docker restart "$ZDT_MAIN_CONTAINER"; then
        zdt_log_error "Failed to restart nginx container"
        # Restore backup
        cp "${ZDT_NGINX_MAIN_CONFIG}.backup" "$ZDT_NGINX_MAIN_CONFIG"
        docker restart "$ZDT_MAIN_CONTAINER"
        return 1
    fi
    
    # Wait for reload
    sleep 3
    
    zdt_log_success "Traffic switched to $target_instance"
    return 0
}

cryptus_get_active_instance() {
    # Method 1: Check through nginx health endpoint
    if docker ps --format "table {{.Names}}" | grep -q "^$ZDT_MAIN_CONTAINER$"; then
        local response=$(docker exec "$ZDT_MAIN_CONTAINER" curl -s "http://localhost$ZDT_HEALTH_ENDPOINT" 2>/dev/null || echo "")
        
        if [ -n "$response" ]; then
            local current_instance=$(echo "$response" | grep -o '"instance":"[^"]*"' | cut -d'"' -f4)
            
            if [ "$current_instance" = "blue" ] || [ "$current_instance" = "green" ]; then
                echo "$current_instance"
                return 0
            fi
        fi
    fi
    
    # Method 2: Check nginx configuration
    if [ -f "$ZDT_NGINX_MAIN_CONFIG" ]; then
        if grep -q "${ZDT_BLUE_CONTAINER}:${ZDT_APP_PORT}" "$ZDT_NGINX_MAIN_CONFIG"; then
            echo "blue"
            return 0
        elif grep -q "${ZDT_GREEN_CONTAINER}:${ZDT_APP_PORT}" "$ZDT_NGINX_MAIN_CONFIG"; then
            echo "green"
            return 0
        fi
    fi
    
    # Method 3: Check external health endpoint
    local external_response=$(curl -s "$ZDT_EXTERNAL_HEALTH_URL" 2>/dev/null || echo "")
    if [ -n "$external_response" ]; then
        local external_instance=$(echo "$external_response" | grep -o '"instance":"[^"]*"' | cut -d'"' -f4)
        if [ "$external_instance" = "blue" ] || [ "$external_instance" = "green" ]; then
            echo "$external_instance"
            return 0
        fi
    fi
    
    # If nothing found
    echo "none"
    return 0
}

cryptus_cleanup() {
    local instance=$1
    
    zdt_log_info "Performing Cryptus-specific cleanup for $instance..."
    
    # Remove nginx backup files
    rm -f "${ZDT_NGINX_MAIN_CONFIG}.backup"
    
    # Clean up docker images
    docker image prune -f >/dev/null 2>&1 || true
    
    return 0
}

cryptus_custom_health_check() {
    local container_name=$1
    local health_endpoint=$2
    
    # Try external health check as fallback
    if [ "$container_name" = "$ZDT_MAIN_CONTAINER" ]; then
        if curl -s -f "$ZDT_EXTERNAL_HEALTH_URL" >/dev/null 2>&1; then
            return 0
        fi
    fi
    
    # Try nginx health endpoint
    if docker exec "$container_name" curl -s -f "http://localhost$ZDT_NGINX_HEALTH_ENDPOINT" >/dev/null 2>&1; then
        return 0
    fi
    
    return 1
}

cryptus_status() {
    echo ""
    zdt_log_info "=== Cryptus Specific Status ==="
    
    # Check main nginx service
    if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "^$ZDT_MAIN_CONTAINER"; then
        zdt_log_success "Main nginx service ($ZDT_MAIN_CONTAINER): Running"
    else
        zdt_log_warning "Main nginx service ($ZDT_MAIN_CONTAINER): Not running"
    fi
    

    
    # Test external health endpoint
    local external_response=$(curl -s "$ZDT_EXTERNAL_HEALTH_URL" 2>/dev/null || echo "Connection failed")
    echo "External Health Check: $external_response"
    
    # Show nginx configuration info
    if [ -f "$ZDT_NGINX_MAIN_CONFIG" ]; then
        local nginx_upstream=$(grep -A 1 "upstream backend" "$ZDT_NGINX_MAIN_CONFIG" | grep "server" | awk '{print $2}' | cut -d':' -f1)
        echo "Nginx upstream: $nginx_upstream"
    fi
}

# ========================================
# LIBRARY CONFIGURATION
# ========================================

# Set function references for the library
ZDT_DEPLOY_BLUE_FUNC="cryptus_deploy_blue"
ZDT_DEPLOY_GREEN_FUNC="cryptus_deploy_green"
ZDT_SWITCH_TRAFFIC_FUNC="cryptus_switch_traffic"
ZDT_GET_ACTIVE_FUNC="cryptus_get_active_instance"
ZDT_CLEANUP_FUNC="cryptus_cleanup"
ZDT_CUSTOM_HEALTH_CHECK_FUNC="cryptus_custom_health_check"
ZDT_STATUS_FUNC="cryptus_status"

# Export configuration for the library
export ZDT_BLUE_CONTAINER
export ZDT_GREEN_CONTAINER
export ZDT_HEALTH_ENDPOINT
export ZDT_DEPLOY_BLUE_FUNC
export ZDT_DEPLOY_GREEN_FUNC
export ZDT_SWITCH_TRAFFIC_FUNC
export ZDT_GET_ACTIVE_FUNC
export ZDT_CLEANUP_FUNC
export ZDT_CUSTOM_HEALTH_CHECK_FUNC
export ZDT_STATUS_FUNC

# ========================================
# HELPER FUNCTIONS
# ========================================

cryptus_ensure_network() {
    if ! docker network ls | grep -q "$ZDT_NETWORK_NAME"; then
        zdt_log_info "Creating Docker network: $ZDT_NETWORK_NAME"
        docker network create "$ZDT_NETWORK_NAME" || {
            zdt_log_error "Failed to create network: $ZDT_NETWORK_NAME"
            return 1
        }
    fi
    return 0
}

cryptus_start_services() {
    zdt_log_info "Starting Cryptus services..."
    
    # Ensure network exists
    cryptus_ensure_network || return 1
    
    # Start main services
    docker compose -f "$ZDT_COMPOSE_FILE" up -d "$ZDT_MAIN_SERVICE" || {
        zdt_log_error "Failed to start main service"
        return 1
    }
    
    zdt_log_success "Cryptus services started"
    return 0
}

cryptus_stop_services() {
    zdt_log_info "Stopping Cryptus services..."
    
    # Stop all services
    docker compose -f "$ZDT_COMPOSE_FILE" down
    docker compose -f "$ZDT_COMPOSE_FILE" --profile "$ZDT_COMPOSE_PROFILE" down
    
    # Clean up backup files
    rm -f "${ZDT_NGINX_MAIN_CONFIG}.backup"
    
    zdt_log_success "Cryptus services stopped"
    return 0
}

# Validate configuration on load
if ! zdt_validate_config; then
    zdt_log_error "Cryptus deployment configuration validation failed"
    exit 1
fi

zdt_log_debug "Cryptus zero downtime deployment configuration loaded successfully" 