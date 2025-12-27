# Тестирование Telegram Mini App через Telegram Web

Этот документ описывает, как использовать Playwright для тестирования реального Telegram Mini App через Telegram Web без мокирования.

## Преимущества

- ✅ Тестирование реального Telegram Mini App в реальной среде Telegram
- ✅ Проверка интеграции с Telegram WebApp API
- ✅ Обнаружение проблем, специфичных для Telegram-окружения
- ✅ Автоматическое сохранение состояния авторизации

## Требования

1. Аккаунт в Telegram
2. Telegram бот с настроенным Mini App
3. Переменные окружения (см. ниже)

## Настройка

### 1. Переменные окружения

Создайте файл `.env` в корне проекта `app/` или установите переменные окружения:

```bash
# Включить тестирование через реальный Telegram Web
USE_REAL_TELEGRAM=true

# Username вашего Telegram бота (без @)
TELEGRAM_BOT_USERNAME=your_bot_username

# Опционально: URL вашего Mini App (для более точного поиска iframe и открытия через URL)
DOMAIN=http://localhost:3000
# или
MINI_APP_URL=http://localhost:3000
```

### 2. Первый запуск

При первом запуске тестов вам нужно будет авторизоваться в Telegram Web:

1. Запустите тесты:
   ```bash
   npm run test:e2e -- --project=telegram-web
   ```

2. Откроется браузер с Telegram Web
3. Отсканируйте QR-код или войдите в аккаунт
4. После успешной авторизации состояние будет сохранено в `app/e2e/.auth/telegram-web.json`
5. При следующих запусках авторизация будет автоматической

## Использование

### Запуск тестов через Telegram Web

```bash
# Запуск всех тестов через Telegram Web
USE_REAL_TELEGRAM=true npm run test:e2e -- --project=telegram-web

# Запуск конкретного теста
USE_REAL_TELEGRAM=true npm run test:e2e -- --project=telegram-web homepage-telegram.spec.ts

# Запуск в headed режиме (с видимым браузером)
USE_REAL_TELEGRAM=true npm run test:e2e -- --project=telegram-web --headed
```

### Запуск обычных тестов (без Telegram Web)

```bash
# Обычные тесты без Telegram Web (используют моки или прямые URL)
npm run test:e2e

# Или явно указать проект
npm run test:e2e -- --project=chromium
```

## Структура файлов

```
app/e2e/
├── fixtures/
│   └── telegram-web.ts          # Fixture для работы с Telegram Web
├── homepage.spec.ts             # Обычные тесты (без Telegram Web)
├── homepage-telegram.spec.ts    # Тесты через Telegram Web
└── .auth/
    └── telegram-web.json        # Сохраненное состояние авторизации (создается автоматически)
```

## Как это работает

1. **Авторизация**: Fixture автоматически открывает Telegram Web и авторизуется (или использует сохраненное состояние)

2. **Поиск бота**: Автоматически ищет бота по username через поиск Telegram Web

3. **Открытие Mini App**: Отправляет команду `/start` боту или нажимает кнопку запуска Mini App

4. **Работа с iframe**: Находит iframe с Mini App и возвращает frame locator для работы с содержимым

5. **Тестирование**: Тесты работают с содержимым Mini App через frame locator

## Пример использования в тестах

```typescript
import { test, expect } from './fixtures/telegram-web';

test.describe('My Tests', () => {
  test.beforeEach(async ({ telegramWebApp }) => {
    // telegramWebApp - это frame locator для iframe с Mini App
    await telegramWebApp.locator('body').waitFor();
  });

  test('example test', async ({ telegramWebApp }) => {
    // Используем telegramWebApp вместо page
    const button = telegramWebApp.getByRole('button', { name: 'Click me' });
    await button.click();
    
    await expect(telegramWebApp.locator('text=Success')).toBeVisible();
  });
});
```

## Устранение проблем

### Проблема: Не удается найти бота

**Решение**: Убедитесь, что:
- `TELEGRAM_BOT_USERNAME` установлен правильно (без @)
- Бот существует и доступен
- Вы авторизованы в правильном аккаунте Telegram

### Проблема: Mini App не открывается

**Решение**: 
- Убедитесь, что бот настроен правильно и имеет кнопку для запуска Mini App
- Проверьте, что Mini App URL настроен в настройках бота
- Попробуйте открыть Mini App вручную в Telegram Web и посмотрите, как это работает

### Проблема: Не удается найти iframe

**Решение**:
- Увеличьте таймауты в `playwright.config.ts`
- Проверьте, что Mini App действительно загружается в iframe
- Запустите тесты в headed режиме (`--headed`) для отладки

### Проблема: Тесты падают из-за таймаутов

**Решение**:
- Telegram Web может быть медленным, увеличьте таймауты:
  ```typescript
  // В playwright.config.ts
  navigationTimeout: 90000,
  actionTimeout: 45000,
  ```

## CI/CD

Для использования в CI/CD:

1. Сохраните состояние авторизации как секрет
2. Восстанавливайте его перед запуском тестов
3. Используйте headless режим:
   ```bash
   USE_REAL_TELEGRAM=true npm run test:e2e -- --project=telegram-web --headless
   ```

**Примечание**: Автоматическая авторизация в CI/CD может быть сложной. Рассмотрите альтернативные подходы для CI/CD (например, использование валидного initData через URL параметры).

## Альтернативные подходы

Если тестирование через Telegram Web не подходит для вашего случая:

1. **Мокирование Telegram WebApp API** - см. обычные тесты в `homepage.spec.ts`
2. **Прямой URL с initData** - используйте специальный URL с валидным initData параметром
3. **Telegram Bot API** - используйте Bot API для генерации валидного initData

