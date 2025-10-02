# Zero Downtime Deployment Library

Универсальная библиотека для реализации развертывания без простоя (zero downtime deployment) с Blue-Green стратегией для любых проектов.

## 🎯 Цель

Абстрагировать логику zero downtime deployment в переиспользуемую библиотеку, которая может работать с:
- Любыми контейнерными платформами (Docker, Podman)
- Любыми load balancer'ами (Nginx, Traefik, HAProxy, AWS ALB, и т.д.)
- Любыми системами оркестрации (Docker Compose, Kubernetes, Swarm)

## 📁 Структура проекта

```
.
├── lib/
│   └── zero-downtime-lib.sh           # Основная библиотека
├── deployment-config.sh       # Конфигурация для Cryptus
├── deploy-simple.sh                   # Упрощенный скрипт развертывания
├── examples/
│   └── generic-project-config.sh      # Пример для любого проекта
└── README-LIBRARY.md                  # Эта документация
```

## 🏗️ Архитектура

### Слои абстракции:

```
┌─────────────────────────────────────┐
│        User Scripts                 │ ← deploy-simple.sh, custom scripts
├─────────────────────────────────────┤
│     Project Configuration          │ ← deployment-config.sh
├─────────────────────────────────────┤
│    Zero Downtime Library           │ ← lib/zero-downtime-lib.sh
├─────────────────────────────────────┤
│     Container Runtime              │ ← Docker, Podman, etc.
└─────────────────────────────────────┘
```

### Принцип работы:

1. **Библиотека** предоставляет общую логику (health checks, rollback, координация)
2. **Конфигурация** адаптирует библиотеку под конкретный проект
3. **Пользовательские скрипты** используют библиотеку для конкретных задач

## 🚀 Быстрый старт

### 1. Для существующего проекта Cryptus:

```bash
# Использовать упрощенный скрипт
chmod +x deploy-simple.sh
./deploy-simple.sh deploy
```

### 2. Для нового проекта:

```bash
# 1. Скопировать библиотеку
cp -r lib/ /path/to/your/project/

# 2. Создать конфигурацию (на основе examples/generic-project-config.sh)
cp examples/generic-project-config.sh your-project-config.sh

# 3. Адаптировать функции под ваш проект
vim your-project-config.sh

# 4. Создать скрипт развертывания
#!/bin/bash
source "./your-project-config.sh"
zdt_deploy
```

## 📝 API библиотеки

### Основные функции:

```bash
# Развертывание
zdt_deploy [custom_args] [skip_cleanup]

# Откат к предыдущей версии
zdt_rollback

# Статус системы
zdt_status

# Переключение трафика
zdt_switch_traffic <blue|green>

# Проверка здоровья
zdt_check_container_health <container_name> [endpoint] [max_attempts] [interval]

# Очистка ресурсов
zdt_cleanup_instance <blue|green> [force]
```

### Служебные функции:

```bash
# Валидация конфигурации
zdt_validate_config

# Определение целевого инстанса
zdt_get_target_instance

# Логирование
zdt_log_info "message"
zdt_log_success "message"
zdt_log_warning "message"
zdt_log_error "message"
zdt_log_debug "message"
```

## ⚙️ Конфигурация

### Обязательные переменные:

```bash
# Имена контейнеров
ZDT_BLUE_CONTAINER="your-app-blue"
ZDT_GREEN_CONTAINER="your-app-green"

# Endpoint для проверки здоровья
ZDT_HEALTH_ENDPOINT="/api/health"

# Функции развертывания (должны быть определены)
ZDT_DEPLOY_BLUE_FUNC="your_deploy_blue_function"
ZDT_DEPLOY_GREEN_FUNC="your_deploy_green_function"
ZDT_SWITCH_TRAFFIC_FUNC="your_switch_traffic_function"
ZDT_GET_ACTIVE_FUNC="your_get_active_function"
```

### Опциональные переменные:

```bash
# Тайм-ауты и интервалы
ZDT_MAX_HEALTH_ATTEMPTS=30
ZDT_HEALTH_CHECK_INTERVAL=5
ZDT_TRAFFIC_SWITCH_TIMEOUT=30

# Дополнительные функции
ZDT_CLEANUP_FUNC="your_cleanup_function"
ZDT_CUSTOM_HEALTH_CHECK_FUNC="your_health_check_function"
ZDT_STATUS_FUNC="your_status_function"

# Отладка
ZDT_DEBUG=false
```

## 🔧 Реализация функций

### 1. Функция развертывания:

```bash
your_deploy_blue() {
    local instance=$1      # "blue" или "green"
    local custom_args=$2   # Дополнительные аргументы
    
    # Ваша логика развертывания:
    # - Остановка старого контейнера
    # - Сборка/скачивание нового образа
    # - Запуск нового контейнера
    # - Ожидание готовности
    
    return 0  # 0 = успех, 1 = ошибка
}
```

### 2. Функция переключения трафика:

```bash
your_switch_traffic() {
    local target_instance=$1  # "blue" или "green"
    
    # Ваша логика переключения:
    # - Обновление конфигурации load balancer'а
    # - Перезагрузка конфигурации
    # - Проверка переключения
    
    return 0
}
```

### 3. Функция определения активного инстанса:

```bash
your_get_active_function() {
    # Логика определения активного инстанса:
    # - Проверка конфигурации load balancer'а
    # - Анализ health endpoint'а
    # - Проверка портов/DNS записей
    
    echo "blue"   # или "green", или "none"
    return 0
}
```

## 📊 Примеры интеграции

### С Nginx:

```bash
nginx_switch_traffic() {
    local target_instance=$1
    
    # Обновить upstream в nginx.conf
    sed -i "s/server app-.*:3000/server app-${target_instance}:3000/" /etc/nginx/nginx.conf
    
    # Перезагрузить nginx
    nginx -s reload
    
    return $?
}
```

### С Traefik:

```bash
traefik_switch_traffic() {
    local target_instance=$1
    
    # Обновить dynamic configuration
    cat > /etc/traefik/dynamic.yml << EOF
http:
  services:
    app-service:
      loadBalancer:
        servers:
          - url: "http://app-${target_instance}:3000"
EOF
    
    return 0  # Traefik автоматически перезагружает конфигурацию
}
```

### С Docker Compose:

```bash
compose_deploy_blue() {
    local instance=$1
    local custom_args=$2
    
    # Остановить старый сервис
    docker compose stop app-blue
    
    # Собрать и запустить новый
    docker compose build app-blue
    docker compose up -d app-blue
    
    return $?
}
```

### С Kubernetes:

```bash
k8s_switch_traffic() {
    local target_instance=$1
    
    # Обновить selector в service
    kubectl patch service app-service -p \
        "{\"spec\":{\"selector\":{\"version\":\"${target_instance}\"}}}"
    
    return $?
}
```

## 🎛️ Переменные окружения

```bash
# Включить отладочный режим
export ZDT_DEBUG=true

# Переопределить тайм-ауты
export ZDT_MAX_HEALTH_ATTEMPTS=60
export ZDT_HEALTH_CHECK_INTERVAL=3

# Кастомные настройки
export ZDT_APP_PORT=8080
export ZDT_HEALTH_ENDPOINT="/healthz"
```

## 🔍 Отладка

### Включить подробное логирование:

```bash
export ZDT_DEBUG=true
./deploy-simple.sh deploy
```

### Проверить конфигурацию:

```bash
source "./your-project-config.sh"
zdt_validate_config
```

### Ручное тестирование функций:

```bash
source "./your-project-config.sh"

# Тест развертывания
your_deploy_blue "blue" ""

# Тест переключения
your_switch_traffic "blue"

# Тест определения активного инстанса
your_get_active_function
```

## 🚨 Обработка ошибок

Библиотека предоставляет встроенную обработку ошибок:

- **Валидация конфигурации** перед выполнением
- **Автоматический rollback** при ошибках переключения
- **Health check** с настраиваемыми тайм-аутами
- **Graceful cleanup** при прерывании процесса

### Коды возврата:

- `0` - Успех
- `1` - Ошибка выполнения
- `2` - Ошибка конфигурации
- `3` - Тайм-аут операции

## 📈 Расширение функциональности

### Добавление метрик:

```bash
# В вашей конфигурации
your_custom_status() {
    echo "=== Custom Metrics ==="
    
    # Показать метрики Prometheus
    curl -s http://localhost:9090/metrics | grep app_requests
    
    # Показать статистику Docker
    docker stats --no-stream
}

ZDT_STATUS_FUNC="your_custom_status"
```

### Интеграция с мониторингом:

```bash
your_deploy_blue() {
    local instance=$1
    
    # Уведомить о начале развертывания
    curl -X POST "http://monitoring/webhook" -d "Starting deployment of $instance"
    
    # Выполнить развертывание
    docker compose up -d "app-$instance"
    
    # Уведомить о завершении
    curl -X POST "http://monitoring/webhook" -d "Deployment of $instance completed"
    
    return 0
}
```

## 🧪 Тестирование

### Unit тесты для функций:

```bash
test_deploy_blue() {
    # Мок-функция для тестирования
    mock_deploy_blue() {
        echo "Mock deployment of $1"
        return 0
    }
    
    ZDT_DEPLOY_BLUE_FUNC="mock_deploy_blue"
    
    # Тест
    if zdt_deploy_instance "blue"; then
        echo "✅ Deploy blue test passed"
    else
        echo "❌ Deploy blue test failed"
    fi
}
```

### Интеграционные тесты:

```bash
# Полный цикл развертывания с проверками
test_full_deployment() {
    echo "🧪 Running full deployment test..."
    
    # Запустить развертывание
    if zdt_deploy; then
        echo "✅ Deployment successful"
    else
        echo "❌ Deployment failed"
        return 1
    fi
    
    # Проверить доступность
    if curl -f "http://localhost/health"; then
        echo "✅ Health check passed"
    else
        echo "❌ Health check failed"
        return 1
    fi
    
    echo "🎉 All tests passed"
}
```

## 📚 Дополнительные ресурсы

- **Cryptus Example**: `deployment-config.sh` - реальный пример
- **Generic Example**: `examples/generic-project-config.sh` - шаблон
- **Original Implementation**: `deploy-traefik-zero-downtime.sh` - оригинальная версия
- **Test Suite**: `test-zero-downtime.sh` - набор тестов

## 🤝 Вклад в развитие

1. Создайте пример конфигурации для вашей платформы
2. Добавьте новые функции в библиотеку
3. Улучшите обработку ошибок
4. Напишите тесты для новой функциональности

## 📄 Лицензия

Эта библиотека предоставляется "как есть" для использования в ваших проектах.

---

**Примечание**: Библиотека протестирована с Docker и Nginx, но должна работать с любыми контейнерными платформами и load balancer'ами при правильной настройке функций адаптера. 