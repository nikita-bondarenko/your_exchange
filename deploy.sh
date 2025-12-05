#!/bin/bash

# Simplified Zero Downtime Deployment Script for $ZDT_MAIN_CONTAINER
# Uses the zero-downtime-lib for all deployment logic

set -e

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source the $ZDT_MAIN_CONTAINER configuration (which includes the library)
source "$SCRIPT_DIR/deployment-config.sh"

chmod -R 777 ./app/data

# ========================================
# COMMAND FUNCTIONS
# ========================================

cmd_deploy() {

    
    echo "🚀 Starting $ZDT_MAIN_CONTAINER Zero Downtime Deployment..."
    echo ""

    mkdir -p /tmp && \
    cp nginx/nginx.conf "/tmp/nginx_conf_backup_$SCRIPT_DIR" &&
    cp app/data/token.txt "/tmp/token_txt_backup_$SCRIPT_DIR"

     git fetch origin 2>/dev/null
    current_branch=$(git branch --show-current)
    if [ $(git rev-list --count HEAD..origin/"$current_branch" 2>/dev/null || echo 0) -gt 0 ]; then
      echo "Найдены новые коммиты на remote в $ZDT_MAIN_CONTAINER - запускаем обновление."
      git fetch origin
      git reset --hard origin/main
    else
      echo "Нет новых коммитов на remote в $SCRIPT_DIR - обновление не требуется."
    fi

        # Возвращаем оригиналы файлов до запуска deploy.sh
    mv "/tmp/nginx_conf_backup_$SCRIPT_DIR" nginx/nginx.conf &&
    mv "/tmp/token_txt_backup_$SCRIPT_DIR" app/data/token.txt
    
    # Use the library's main deployment function
    if zdt_deploy "$@"; then
        echo ""
        echo "🎉 Deployment completed successfully!"
        echo "🔗 Service available at: $ZDT_EXTERNAL_HEALTH_URL"
    else
        echo ""
        echo "❌ Deployment failed!"
        return 1
    fi
    docker system prune -a -f
}

cmd_status() {
    echo "📊 $ZDT_MAIN_CONTAINER Deployment Status"
    echo "=================================="
    
    # Use the library's status function
    zdt_status
}

cmd_rollback() {
    echo "🔄 Starting $ZDT_MAIN_CONTAINER Rollback..."
    echo ""
    
    if zdt_rollback; then
        echo ""
        echo "✅ Rollback completed successfully!"
    else
        echo ""
        echo "❌ Rollback failed!"
        return 1
    fi
}

cmd_start() {
    echo "▶️  Starting $ZDT_MAIN_CONTAINER Services..."
    echo ""
    
    if alex_start_services; then
        echo ""
        echo "✅ Services started successfully!"
        echo "🔗 Available at: $ZDT_EXTERNAL_HEALTH_URL"
    else
        echo ""
        echo "❌ Failed to start services!"
        return 1
    fi
}

cmd_stop() {
    echo "⏹️  Stopping $ZDT_MAIN_CONTAINER Services..."
    echo ""
    
    if alex_stop_services; then
        echo ""
        echo "✅ Services stopped successfully!"
    else
        echo ""
        echo "❌ Failed to stop services!"
        return 1
    fi
}

cmd_cleanup() {
    echo "🧹 Cleaning up $ZDT_MAIN_CONTAINER Resources..."
    echo ""
    
    # Stop all services
    alex_stop_services
    
    # Clean up both instances
    zdt_cleanup_instance "blue" true
    zdt_cleanup_instance "green" true
    
    # Additional cleanup
    docker image prune -f >/dev/null 2>&1 || true
    
    echo "✅ Cleanup completed!"
}

cmd_logs() {
    local service=${1:-}
    local follow=${2:-false}
    
    if [ -z "$service" ]; then
        echo "Available services:"
        echo "  - main ($ZDT_MAIN_CONTAINER nginx)"
        echo "  - blue ($ZDT_MAIN_CONTAINER-blue)"
        echo "  - green ($ZDT_MAIN_CONTAINER-green)"
        echo ""
        echo "Usage: $0 logs <service> [follow]"
        return 1
    fi
    
    local container_name=""
    case "$service" in
        "main")
            container_name="$ZDT_MAIN_CONTAINER"
            ;;
        "blue")
            container_name="$ZDT_BLUE_CONTAINER"
            ;;
        "green")
            container_name="$ZDT_GREEN_CONTAINER"
            ;;
        *)
            zdt_log_error "Unknown service: $service"
            return 1
            ;;
    esac
    
    echo "📋 Showing logs for $service ($container_name)..."
    echo ""
    
    if [ "$follow" = "true" ] || [ "$follow" = "-f" ]; then
        docker logs -f "$container_name"
    else
        docker logs "$container_name"
    fi
}

cmd_switch() {
    local target_instance=${1:-}
    
    if [ -z "$target_instance" ]; then
        echo "Usage: $0 switch <blue|green>"
        return 1
    fi
    
    echo "🔄 Manually switching traffic to $target_instance..."
    echo ""
    
    if zdt_switch_traffic "$target_instance"; then
        echo ""
        echo "✅ Traffic switched to $target_instance successfully!"
    else
        echo ""
        echo "❌ Traffic switch failed!"
        return 1
    fi
}

cmd_health() {
    echo "🏥 Health Check Report"
    echo "====================="
    echo ""
    
    # Check external health
    echo "External Health Check:"
    local external_response=$(curl -s "$ZDT_EXTERNAL_HEALTH_URL" 2>/dev/null || echo "Connection failed")
    echo "$external_response"
    echo ""
    
    # Check individual containers
    for instance in blue green; do
        local container_name=""
        if [ "$instance" = "blue" ]; then
            container_name="$ZDT_BLUE_CONTAINER"
        else
            container_name="$ZDT_GREEN_CONTAINER"
        fi
        
        echo "$instance instance ($container_name):"
        if docker ps --format "table {{.Names}}" | grep -q "^$container_name$"; then
            if zdt_check_container_health "$container_name" "$ZDT_HEALTH_ENDPOINT" 1 1; then
                echo "  ✅ Healthy"
            else
                echo "  ❌ Unhealthy"
            fi
        else
            echo "  ⏹️  Not running"
        fi
    done
    
    echo ""
    echo "Active instance: $(alex_get_active_instance)"
}

cmd_version() {
    echo "$ZDT_MAIN_CONTAINER Zero Downtime Deployment"
    echo "================================="
    zdt_version
    echo "Configuration: deployment-config.sh"
    echo "External URL: $ZDT_EXTERNAL_HEALTH_URL"
}

cmd_help() {
    cat << EOF
$ZDT_MAIN_CONTAINER Zero Downtime Deployment Tool

USAGE:
    $0 [COMMAND] [OPTIONS]

COMMANDS:
    deploy              Perform zero downtime deployment (default)
    start               Start all $ZDT_MAIN_CONTAINER services
    stop                Stop all $ZDT_MAIN_CONTAINER services
    status              Show deployment status
    rollback            Rollback to previous version
    switch <instance>   Manually switch traffic to blue/green
    cleanup             Clean up all resources
    logs <service> [-f] Show logs for service (main|blue|green|redis)
    health              Show detailed health status
    version             Show version information
    help                Show this help message

EXAMPLES:
    $0                  # Deploy new version
    $0 deploy           # Deploy new version
    $0 status           # Check status
    $0 logs blue -f     # Follow blue instance logs
    $0 switch green     # Switch traffic to green
    $0 rollback         # Rollback deployment
    $0 cleanup          # Clean up everything

ENVIRONMENT:
    ZDT_DEBUG=true      Enable debug logging
    
HEALTH CHECK:
    External: $ZDT_EXTERNAL_HEALTH_URL

For more information, see README-ZERO-DOWNTIME.md
EOF
}

# ========================================
# MAIN SCRIPT LOGIC
# ========================================

main() {
    local command=${1:-deploy}
    shift || true
    
    # Check Docker availability
    if ! docker info >/dev/null 2>&1; then
        zdt_log_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    case "$command" in
        "deploy")
            cmd_deploy "$@"
            ;;
        "start")
            cmd_start "$@"
            ;;
        "stop")
            cmd_stop "$@"
            ;;
        "status")
            cmd_status "$@"
            ;;
        "rollback")
            cmd_rollback "$@"
            ;;
        "switch")
            cmd_switch "$@"
            ;;
        "cleanup")
            cmd_cleanup "$@"
            ;;
        "logs")
            cmd_logs "$@"
            ;;
        "health")
            cmd_health "$@"
            ;;
        "version")
            cmd_version "$@"
            ;;
        "help"|"--help"|"-h")
            cmd_help "$@"
            ;;
        *)
            zdt_log_error "Unknown command: $command"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@" 