#!/bin/bash

# Example: Generic Project Zero Downtime Deployment Configuration
# This shows how to adapt the zero-downtime library for any project

# Source the zero downtime library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../lib/zero-downtime-lib.sh"

# ========================================
# PROJECT CONFIGURATION
# ========================================

# Container names (customize for your project)
ZDT_BLUE_CONTAINER="myapp-blue"
ZDT_GREEN_CONTAINER="myapp-green"
ZDT_LOAD_BALANCER_CONTAINER="myapp-lb"

# Service configuration
ZDT_COMPOSE_FILE="docker-compose.yml"
ZDT_BLUE_SERVICE="app-blue"
ZDT_GREEN_SERVICE="app-green"

# Health check configuration
ZDT_HEALTH_ENDPOINT="/health"
ZDT_APP_PORT="8080"

# External URLs
ZDT_EXTERNAL_HEALTH_URL="https://myapp.example.com/health"

# ========================================
# DEPLOYMENT FUNCTIONS (CUSTOMIZE THESE)
# ========================================

myapp_deploy_blue() {
    local instance=$1
    local custom_args=$2
    
    zdt_log_info "Deploying blue instance for MyApp..."
    
    # Example: Stop old container
    docker stop "$ZDT_BLUE_CONTAINER" 2>/dev/null || true
    docker rm "$ZDT_BLUE_CONTAINER" 2>/dev/null || true
    
    # Example: Start new container
    docker run -d \
        --name "$ZDT_BLUE_CONTAINER" \
        --network myapp-network \
        -p 8081:8080 \
        -e INSTANCE_COLOR=blue \
        myapp:latest
    
    return $?
}

myapp_deploy_green() {
    local instance=$1
    local custom_args=$2
    
    zdt_log_info "Deploying green instance for MyApp..."
    
    # Example: Stop old container
    docker stop "$ZDT_GREEN_CONTAINER" 2>/dev/null || true
    docker rm "$ZDT_GREEN_CONTAINER" 2>/dev/null || true
    
    # Example: Start new container
    docker run -d \
        --name "$ZDT_GREEN_CONTAINER" \
        --network myapp-network \
        -p 8082:8080 \
        -e INSTANCE_COLOR=green \
        myapp:latest
    
    return $?
}

myapp_switch_traffic() {
    local target_instance=$1
    
    zdt_log_info "Switching traffic to $target_instance via load balancer..."
    
    # Example: Update load balancer configuration
    # This could be:
    # - Updating nginx config
    # - Calling API to update Traefik rules
    # - Updating HAProxy config
    # - Calling cloud load balancer API
    
    local target_port=""
    if [ "$target_instance" = "blue" ]; then
        target_port="8081"
    else
        target_port="8082"
    fi
    
    # Example: Update nginx upstream via API or config file
    # curl -X POST "http://lb-admin:9090/upstream" \
    #      -d "{\"backend\": \"http://myapp-$target_instance:8080\"}"
    
    # For this example, we'll simulate by updating a simple config
    echo "upstream myapp-backend { server 127.0.0.1:$target_port; }" > /tmp/myapp-upstream.conf
    
    # Reload load balancer
    docker exec "$ZDT_LOAD_BALANCER_CONTAINER" nginx -s reload 2>/dev/null || true
    
    return 0
}

myapp_get_active_instance() {
    # Example: Check which instance is currently active
    # This could be:
    # - Checking load balancer config
    # - Calling health endpoint and checking response
    # - Checking which port is configured
    
    # Method 1: Check current upstream config
    if [ -f "/tmp/myapp-upstream.conf" ]; then
        if grep -q "8081" "/tmp/myapp-upstream.conf"; then
            echo "blue"
            return 0
        elif grep -q "8082" "/tmp/myapp-upstream.conf"; then
            echo "green"
            return 0
        fi
    fi
    
    # Method 2: Check external health endpoint
    local health_response=$(curl -s "$ZDT_EXTERNAL_HEALTH_URL" 2>/dev/null || echo "")
    if echo "$health_response" | grep -q '"instance":"blue"'; then
        echo "blue"
        return 0
    elif echo "$health_response" | grep -q '"instance":"green"'; then
        echo "green"
        return 0
    fi
    
    # Default: none
    echo "none"
    return 0
}

myapp_cleanup() {
    local instance=$1
    
    zdt_log_info "Cleaning up MyApp $instance instance..."
    
    # Remove temporary config files
    rm -f "/tmp/myapp-upstream.conf.backup"
    
    # Clean up Docker volumes, networks, etc.
    docker volume prune -f >/dev/null 2>&1 || true
    
    return 0
}

myapp_custom_health_check() {
    local container_name=$1
    local health_endpoint=$2
    
    # Example: Custom health check logic
    # Check if application-specific endpoints are working
    
    # Try application-specific health check
    if docker exec "$container_name" curl -s -f "http://localhost:8080/readiness" >/dev/null 2>&1; then
        return 0
    fi
    
    # Try database connectivity check
    if docker exec "$container_name" curl -s -f "http://localhost:8080/db-health" >/dev/null 2>&1; then
        return 0
    fi
    
    return 1
}

myapp_status() {
    echo ""
    zdt_log_info "=== MyApp Specific Status ==="
    
    # Check load balancer
    if docker ps --format "table {{.Names}}" | grep -q "^$ZDT_LOAD_BALANCER_CONTAINER$"; then
        zdt_log_success "Load Balancer ($ZDT_LOAD_BALANCER_CONTAINER): Running"
    else
        zdt_log_warning "Load Balancer ($ZDT_LOAD_BALANCER_CONTAINER): Not running"
    fi
    
    # Show current upstream configuration
    if [ -f "/tmp/myapp-upstream.conf" ]; then
        local upstream=$(cat "/tmp/myapp-upstream.conf" | grep -o "127.0.0.1:[0-9]*")
        echo "Current upstream: $upstream"
    fi
    
    # Test external endpoint
    local external_response=$(curl -s "$ZDT_EXTERNAL_HEALTH_URL" 2>/dev/null || echo "Connection failed")
    echo "External Health: $external_response"
}

# ========================================
# LIBRARY CONFIGURATION
# ========================================

# Set function references for the library
ZDT_DEPLOY_BLUE_FUNC="myapp_deploy_blue"
ZDT_DEPLOY_GREEN_FUNC="myapp_deploy_green"
ZDT_SWITCH_TRAFFIC_FUNC="myapp_switch_traffic"
ZDT_GET_ACTIVE_FUNC="myapp_get_active_instance"
ZDT_CLEANUP_FUNC="myapp_cleanup"
ZDT_CUSTOM_HEALTH_CHECK_FUNC="myapp_custom_health_check"
ZDT_STATUS_FUNC="myapp_status"

# Export configuration
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
# PROJECT-SPECIFIC HELPER FUNCTIONS
# ========================================

myapp_ensure_network() {
    if ! docker network ls | grep -q "myapp-network"; then
        zdt_log_info "Creating MyApp network..."
        docker network create myapp-network
    fi
}

myapp_start_load_balancer() {
    zdt_log_info "Starting MyApp load balancer..."
    
    # Ensure network exists
    myapp_ensure_network
    
    # Start load balancer container
    docker run -d \
        --name "$ZDT_LOAD_BALANCER_CONTAINER" \
        --network myapp-network \
        -p 80:80 \
        -v /tmp/myapp-upstream.conf:/etc/nginx/conf.d/upstream.conf:ro \
        nginx:alpine
    
    return $?
}

myapp_full_deploy() {
    zdt_log_info "Starting full MyApp deployment..."
    
    # Ensure prerequisites
    myapp_ensure_network
    
    # Start load balancer if not running
    if ! docker ps --format "table {{.Names}}" | grep -q "^$ZDT_LOAD_BALANCER_CONTAINER$"; then
        myapp_start_load_balancer
    fi
    
    # Use library's deployment function
    zdt_deploy "$@"
}

# Validate configuration
if ! zdt_validate_config; then
    zdt_log_error "MyApp deployment configuration validation failed"
    exit 1
fi

zdt_log_debug "MyApp zero downtime deployment configuration loaded successfully"

# ========================================
# USAGE EXAMPLE
# ========================================

# You can now use this configuration file like this:
#
# #!/bin/bash
# source "./generic-project-config.sh"
# 
# case "${1:-deploy}" in
#     "deploy")
#         myapp_full_deploy
#         ;;
#     "status")
#         zdt_status
#         ;;
#     "rollback")
#         zdt_rollback
#         ;;
#     *)
#         echo "Usage: $0 [deploy|status|rollback]"
#         ;;
# esac 