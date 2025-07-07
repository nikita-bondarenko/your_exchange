#!/bin/bash

# Zero Downtime Deployment Library
# Universal library for blue-green deployments with any load balancer
# Version: 1.0.0

# Library configuration (can be overridden)
ZDT_LIB_VERSION="1.0.0"
ZDT_DEBUG=${ZDT_DEBUG:-false}
ZDT_MAX_HEALTH_ATTEMPTS=${ZDT_MAX_HEALTH_ATTEMPTS:-30}
ZDT_HEALTH_CHECK_INTERVAL=${ZDT_HEALTH_CHECK_INTERVAL:-5}
ZDT_TRAFFIC_SWITCH_TIMEOUT=${ZDT_TRAFFIC_SWITCH_TIMEOUT:-30}

# Colors for output
ZDT_RED='\033[0;31m'
ZDT_GREEN='\033[0;32m'
ZDT_YELLOW='\033[1;33m'
ZDT_BLUE='\033[0;34m'
ZDT_NC='\033[0m' # No Color

# ========================================
# LOGGING FUNCTIONS
# ========================================

zdt_log_debug() {
    if [ "$ZDT_DEBUG" = "true" ]; then
        echo -e "${ZDT_BLUE}[DEBUG]${ZDT_NC} $1" >&2
    fi
}

zdt_log_info() {
    echo -e "${ZDT_BLUE}[INFO]${ZDT_NC} $1"
}

zdt_log_success() {
    echo -e "${ZDT_GREEN}[SUCCESS]${ZDT_NC} $1"
}

zdt_log_warning() {
    echo -e "${ZDT_YELLOW}[WARNING]${ZDT_NC} $1"
}

zdt_log_error() {
    echo -e "${ZDT_RED}[ERROR]${ZDT_NC} $1" >&2
}

# ========================================
# VALIDATION FUNCTIONS
# ========================================

zdt_validate_config() {
    local required_vars=(
        "ZDT_BLUE_CONTAINER"
        "ZDT_GREEN_CONTAINER" 
        "ZDT_HEALTH_ENDPOINT"
        "ZDT_DEPLOY_BLUE_FUNC"
        "ZDT_DEPLOY_GREEN_FUNC"
        "ZDT_SWITCH_TRAFFIC_FUNC"
        "ZDT_GET_ACTIVE_FUNC"
    )
    
    zdt_log_debug "Validating configuration..."
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            zdt_log_error "Required configuration variable $var is not set"
            return 1
        fi
    done
    
    # Validate functions exist
    for func in "$ZDT_DEPLOY_BLUE_FUNC" "$ZDT_DEPLOY_GREEN_FUNC" "$ZDT_SWITCH_TRAFFIC_FUNC" "$ZDT_GET_ACTIVE_FUNC"; do
        if ! declare -f "$func" >/dev/null 2>&1; then
            zdt_log_error "Required function $func is not defined"
            return 1
        fi
    done
    
    zdt_log_debug "Configuration validation passed"
    return 0
}

zdt_validate_instance() {
    local instance=$1
    
    if [ "$instance" != "blue" ] && [ "$instance" != "green" ]; then
        zdt_log_error "Invalid instance: $instance. Must be 'blue' or 'green'"
        return 1
    fi
    
    return 0
}

# ========================================
# HEALTH CHECK FUNCTIONS
# ========================================

zdt_check_container_health() {
    local container_name=$1
    local health_endpoint=${2:-$ZDT_HEALTH_ENDPOINT}
    local max_attempts=${3:-$ZDT_MAX_HEALTH_ATTEMPTS}
    local interval=${4:-$ZDT_HEALTH_CHECK_INTERVAL}
    
    zdt_log_info "Checking health of $container_name..."
    zdt_log_debug "Health endpoint: $health_endpoint, Max attempts: $max_attempts, Interval: ${interval}s"
    
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        zdt_log_debug "Health check attempt $attempt/$max_attempts for $container_name"
        
        # Try different health check methods
        local health_result=""
        
        # Method 1: Direct container exec
        if docker exec "$container_name" curl -s -f "http://localhost:3000$health_endpoint" >/dev/null 2>&1; then
            health_result="success"
        # Method 2: Custom health check function if provided
        elif [ -n "$ZDT_CUSTOM_HEALTH_CHECK_FUNC" ] && declare -f "$ZDT_CUSTOM_HEALTH_CHECK_FUNC" >/dev/null 2>&1; then
            if $ZDT_CUSTOM_HEALTH_CHECK_FUNC "$container_name" "$health_endpoint"; then
                health_result="success"
            fi
        # Method 3: Docker health check
        elif [ "$(docker inspect --format='{{.State.Health.Status}}' "$container_name" 2>/dev/null)" = "healthy" ]; then
            health_result="success"
        fi
        
        if [ "$health_result" = "success" ]; then
            zdt_log_success "$container_name is healthy"
            return 0
        fi
        
        zdt_log_debug "Attempt $attempt/$max_attempts: $container_name not ready yet..."
        sleep "$interval"
        attempt=$((attempt + 1))
    done
    
    zdt_log_error "$container_name failed health check after $max_attempts attempts"
    return 1
}

zdt_wait_for_container() {
    local container_name=$1
    local timeout=${2:-60}
    
    zdt_log_info "Waiting for container $container_name to start..."
    
    local elapsed=0
    while [ $elapsed -lt $timeout ]; do
        if docker ps --format "table {{.Names}}" | grep -q "^$container_name$"; then
            zdt_log_success "Container $container_name is running"
            return 0
        fi
        
        sleep 2
        elapsed=$((elapsed + 2))
    done
    
    zdt_log_error "Container $container_name failed to start within ${timeout}s"
    return 1
}

# ========================================
# DEPLOYMENT FUNCTIONS
# ========================================

zdt_deploy_instance() {
    local target_instance=$1
    local custom_deploy_args=${2:-""}
    
    zdt_validate_instance "$target_instance" || return 1
    
    zdt_log_info "Deploying to $target_instance instance..."
    
    local deploy_func=""
    local container_name=""
    
    if [ "$target_instance" = "blue" ]; then
        deploy_func="$ZDT_DEPLOY_BLUE_FUNC"
        container_name="$ZDT_BLUE_CONTAINER"
    else
        deploy_func="$ZDT_DEPLOY_GREEN_FUNC" 
        container_name="$ZDT_GREEN_CONTAINER"
    fi
    
    zdt_log_debug "Using deploy function: $deploy_func for container: $container_name"
    
    # Call the custom deployment function
    if ! $deploy_func "$target_instance" "$custom_deploy_args"; then
        zdt_log_error "Deployment function failed for $target_instance instance"
        return 1
    fi
    
    # Wait for container to be running
    if ! zdt_wait_for_container "$container_name"; then
        zdt_log_error "Container $container_name failed to start"
        return 1
    fi
    
    # Check health
    if ! zdt_check_container_health "$container_name"; then
        zdt_log_error "Health check failed for $target_instance instance"
        return 1
    fi
    
    zdt_log_success "$target_instance instance deployed successfully"
    return 0
}

zdt_get_target_instance() {
    local current_active=""
    
    # Get current active instance using custom function
    if ! current_active=$($ZDT_GET_ACTIVE_FUNC); then
        zdt_log_error "Failed to get current active instance"
        return 1
    fi
    
    zdt_log_debug "Current active instance: $current_active"
    
    # Determine target instance
    local target_instance=""
    case "$current_active" in
        "blue")
            target_instance="green"
            ;;
        "green") 
            target_instance="blue"
            ;;
        "none"|"")
            # First deployment - start with blue
            target_instance="blue"
            zdt_log_info "First deployment detected - using blue instance"
            ;;
        *)
            # Fallback to blue for unknown states
            target_instance="blue"
            zdt_log_warning "Unknown active instance '$current_active' - defaulting to blue"
            ;;
    esac
    
    echo "$target_instance"
    return 0
}

# ========================================
# TRAFFIC SWITCHING FUNCTIONS
# ========================================

zdt_switch_traffic() {
    local target_instance=$1
    local verification_timeout=${2:-$ZDT_TRAFFIC_SWITCH_TIMEOUT}
    
    zdt_validate_instance "$target_instance" || return 1
    
    zdt_log_info "Switching traffic to $target_instance instance..."
    
    # Call custom traffic switching function
    if ! $ZDT_SWITCH_TRAFFIC_FUNC "$target_instance"; then
        zdt_log_error "Traffic switching function failed"
        return 1
    fi
    
    # Verify the switch
    if ! zdt_verify_traffic_switch "$target_instance" "$verification_timeout"; then
        zdt_log_error "Traffic switch verification failed"
        return 1
    fi
    
    zdt_log_success "Traffic successfully switched to $target_instance"
    return 0
}

zdt_verify_traffic_switch() {
    local target_instance=$1
    local timeout=${2:-$ZDT_TRAFFIC_SWITCH_TIMEOUT}
    local interval=3
    
    zdt_log_debug "Verifying traffic switch to $target_instance..."
    
    local elapsed=0
    while [ $elapsed -lt $timeout ]; do
        # Get current active instance
        local current_active=""
        if current_active=$($ZDT_GET_ACTIVE_FUNC 2>/dev/null); then
            if [ "$current_active" = "$target_instance" ]; then
                zdt_log_debug "Traffic switch verification successful"
                return 0
            fi
        fi
        
        zdt_log_debug "Verification attempt: current=$current_active, target=$target_instance"
        sleep $interval
        elapsed=$((elapsed + interval))
    done
    
    zdt_log_error "Traffic switch verification timed out after ${timeout}s"
    return 1
}

# ========================================
# ROLLBACK FUNCTIONS
# ========================================

zdt_rollback() {
    local current_active=""
    
    zdt_log_info "Starting rollback procedure..."
    
    # Get current active instance
    if ! current_active=$($ZDT_GET_ACTIVE_FUNC); then
        zdt_log_error "Cannot determine current active instance for rollback"
        return 1
    fi
    
    # Determine rollback target
    local rollback_target=""
    if [ "$current_active" = "blue" ]; then
        rollback_target="green"
    elif [ "$current_active" = "green" ]; then
        rollback_target="blue"
    else
        zdt_log_error "Cannot rollback: no previous instance available"
        return 1
    fi
    
    zdt_log_info "Rolling back from $current_active to $rollback_target..."
    
    # Check if rollback target is healthy
    local rollback_container=""
    if [ "$rollback_target" = "blue" ]; then
        rollback_container="$ZDT_BLUE_CONTAINER"
    else
        rollback_container="$ZDT_GREEN_CONTAINER"
    fi
    
    if ! zdt_check_container_health "$rollback_container"; then
        zdt_log_error "Rollback target $rollback_target is not healthy"
        return 1
    fi
    
    # Switch traffic back
    if ! zdt_switch_traffic "$rollback_target"; then
        zdt_log_error "Rollback traffic switch failed"
        return 1
    fi
    
    zdt_log_success "Rollback completed successfully to $rollback_target"
    return 0
}

# ========================================
# CLEANUP FUNCTIONS
# ========================================

zdt_cleanup_instance() {
    local instance=$1
    local force=${2:-false}
    
    zdt_validate_instance "$instance" || return 1
    
    local container_name=""
    if [ "$instance" = "blue" ]; then
        container_name="$ZDT_BLUE_CONTAINER"
    else
        container_name="$ZDT_GREEN_CONTAINER"
    fi
    
    zdt_log_info "Cleaning up $instance instance ($container_name)..."
    
    # Stop container if running
    if docker ps --format "table {{.Names}}" | grep -q "^$container_name$"; then
        zdt_log_debug "Stopping container $container_name"
        if ! docker stop "$container_name" >/dev/null 2>&1; then
            if [ "$force" = "true" ]; then
                zdt_log_warning "Force stopping container $container_name"
                docker kill "$container_name" >/dev/null 2>&1 || true
            else
                zdt_log_error "Failed to stop container $container_name"
                return 1
            fi
        fi
    fi
    
    # Call custom cleanup function if provided
    if [ -n "$ZDT_CLEANUP_FUNC" ] && declare -f "$ZDT_CLEANUP_FUNC" >/dev/null 2>&1; then
        zdt_log_debug "Calling custom cleanup function"
        $ZDT_CLEANUP_FUNC "$instance"
    fi
    
    zdt_log_success "$instance instance cleaned up"
    return 0
}

# ========================================
# MAIN DEPLOYMENT FUNCTION
# ========================================

zdt_deploy() {
    local custom_args=${1:-""}
    local skip_cleanup=${2:-false}
    
    zdt_log_info "Starting zero downtime deployment (lib v$ZDT_LIB_VERSION)..."
    
    # Validate configuration
    if ! zdt_validate_config; then
        zdt_log_error "Configuration validation failed"
        return 1
    fi
    
    # Get current and target instances
    local current_active=""
    local target_instance=""
    
    if ! current_active=$($ZDT_GET_ACTIVE_FUNC); then
        zdt_log_error "Failed to get current active instance"
        return 1
    fi
    
    if ! target_instance=$(zdt_get_target_instance); then
        zdt_log_error "Failed to determine target instance"
        return 1
    fi
    
    zdt_log_info "Deployment plan: $current_active → $target_instance"
    
    # Deploy to target instance
    if ! zdt_deploy_instance "$target_instance" "$custom_args"; then
        zdt_log_error "Deployment to $target_instance failed"
        return 1
    fi
    
    # Switch traffic
    if ! zdt_switch_traffic "$target_instance"; then
        zdt_log_error "Traffic switch failed, attempting cleanup..."
        zdt_cleanup_instance "$target_instance" true
        return 1
    fi
    
    # Cleanup old instance
    if [ "$skip_cleanup" != "true" ] && [ "$current_active" != "none" ] && [ "$current_active" != "" ]; then
        zdt_log_info "Cleaning up old instance: $current_active"
        zdt_cleanup_instance "$current_active" || zdt_log_warning "Cleanup of old instance failed"
    fi
    
    zdt_log_success "Zero downtime deployment completed successfully!"
    zdt_log_success "Active instance: $target_instance"
    
    return 0
}

# ========================================
# STATUS AND UTILITY FUNCTIONS
# ========================================

zdt_status() {
    zdt_log_info "=== Zero Downtime Deployment Status ==="
    
    # Show library version
    echo "Library Version: $ZDT_LIB_VERSION"
    
    # Get active instance
    local active=""
    if active=$($ZDT_GET_ACTIVE_FUNC 2>/dev/null); then
        echo "Active Instance: $active"
    else
        echo "Active Instance: Unknown"
    fi
    
    # Check instance statuses
    for instance in blue green; do
        local container_name=""
        if [ "$instance" = "blue" ]; then
            container_name="$ZDT_BLUE_CONTAINER"
        else
            container_name="$ZDT_GREEN_CONTAINER"
        fi
        
        if docker ps --format "table {{.Names}}" | grep -q "^$container_name$"; then
            zdt_log_success "$instance instance ($container_name): Running"
        else
            zdt_log_warning "$instance instance ($container_name): Not running"
        fi
    done
    
    # Call custom status function if provided
    if [ -n "$ZDT_STATUS_FUNC" ] && declare -f "$ZDT_STATUS_FUNC" >/dev/null 2>&1; then
        echo ""
        zdt_log_debug "Calling custom status function"
        $ZDT_STATUS_FUNC
    fi
}

zdt_version() {
    echo "Zero Downtime Deployment Library v$ZDT_LIB_VERSION"
}

# ========================================
# INITIALIZATION
# ========================================

zdt_init() {
    zdt_log_debug "Initializing Zero Downtime Deployment Library v$ZDT_LIB_VERSION"
    
    # Set default values if not provided
    ZDT_HEALTH_ENDPOINT=${ZDT_HEALTH_ENDPOINT:-"/api/health"}
    ZDT_APP_PORT=${ZDT_APP_PORT:-"3000"}
    
    zdt_log_debug "Library initialized successfully"
}

# Auto-initialize when sourced
zdt_init 