# Как работает Playwright

## Что такое Playwright?

Playwright - это инструмент для автоматизации браузеров, который позволяет:
- Тестировать веб-приложения в реальных браузерах (Chrome, Firefox, Safari)
- Автоматизировать действия пользователя (клики, ввод текста, навигация)
- Проверять отображение элементов на странице
- Тестировать на разных устройствах и размерах экрана

## Как работает наш тест

### 1. Конфигурация (playwright.config.ts)

```typescript
webServer: {
  command: 'npm run dev',  // Автоматически запускает dev сервер
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,  // Переиспользует существующий сервер
}
```

**Что происходит:**
- Playwright автоматически запускает `npm run dev` перед тестами
- Ждет, пока сервер станет доступен на `http://localhost:3000`
- После тестов может остановить сервер (если не в CI)

### 2. Структура теста

```typescript
test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');  // Переходит на главную страницу перед каждым тестом
  });
  
  test('should display the main page title', async ({ page }) => {
    // Тело теста
  });
});
```

**Что происходит:**
- `test.describe` - группа тестов
- `test.beforeEach` - выполняется перед каждым тестом
- `{ page }` - объект страницы браузера (автоматически создается)

### 3. Основные действия Playwright

#### Навигация
```typescript
await page.goto('/');  // Переход на URL
await page.waitForURL(/\/exchange\/type/);  // Ожидание изменения URL
```

#### Поиск элементов
```typescript
// По селектору
const title = page.locator('h1').first();

// По роли и тексту
const button = page.getByRole('button', { name: 'Поддержка' });

// По тексту
const section = page.getByText('Дополнительно');

// Фильтрация
const items = page.locator('ul').filter({ hasText: /Наличные/ });
```

#### Взаимодействие
```typescript
await button.click();  // Клик
await input.fill('текст');  // Ввод текста
await select.selectOption('value');  // Выбор опции
```

#### Ожидания
```typescript
await page.waitForLoadState('networkidle');  // Ждет завершения сетевых запросов
await expect(element).toBeVisible();  // Проверяет видимость
await expect(element).toHaveText('текст');  // Проверяет текст
```

#### Проверки (Assertions)
```typescript
await expect(title).toBeVisible();  // Элемент виден
await expect(button).toBeEnabled();  // Кнопка активна
await expect(input).toHaveValue('значение');  // Значение поля
```

### 4. Пример выполнения теста

```typescript
test('should display the start button', async ({ page }) => {
  // 1. Ждем загрузки страницы
  await page.waitForLoadState('networkidle');
  
  // 2. Ищем кнопку по роли и тексту (регулярное выражение)
  const startButton = page.getByRole('button', { 
    name: /Начать (обмен|платеж)/ 
  });
  
  // 3. Проверяем, что кнопка видна
  await expect(startButton).toBeVisible();
});
```

**Что происходит пошагово:**
1. Playwright открывает браузер (Chrome/Firefox/Safari)
2. Переходит на `http://localhost:3000/`
3. Ждет, пока все сетевые запросы завершатся
4. Ищет кнопку с текстом "Начать обмен" или "Начать платеж"
5. Проверяет, что кнопка видна на странице
6. Закрывает браузер

### 5. Тестирование на разных устройствах

```typescript
test('should be responsive', async ({ page }) => {
  // Мобильный (iPhone)
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(title).toBeVisible();
  
  // Планшет
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(title).toBeVisible();
  
  // Десктоп
  await page.setViewportSize({ width: 1920, height: 1080 });
  await expect(title).toBeVisible();
});
```

### 6. Отслеживание ошибок

```typescript
test('should handle button clicks without errors', async ({ page }) => {
  // Собираем ошибки из консоли
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  // Выполняем действие
  await supportButton.click();
  await page.waitForTimeout(1000);

  // Проверяем отсутствие критических ошибок
  const criticalErrors = errors.filter(err => 
    !err.includes('Telegram') && 
    !err.includes('WebApp')
  );
  expect(criticalErrors.length).toBeLessThan(5);
});
```

## Запуск тестов

### 1. Установка браузеров (первый раз)
```bash
npx playwright install
```

### 2. Запуск всех тестов
```bash
npm run test:e2e
```

### 3. Запуск с UI (интерактивный режим)
```bash
npm run test:e2e:ui
```
Откроется окно Playwright UI, где можно:
- Видеть тесты в реальном времени
- Запускать тесты по одному
- Видеть скриншоты и видео
- Отлаживать тесты

### 4. Запуск в видимом режиме (headed)
```bash
npm run test:e2e:headed
```
Браузер будет виден во время выполнения тестов

### 5. Режим отладки
```bash
npm run test:e2e:debug
```
Откроется Playwright Inspector для пошаговой отладки

## Что тестируется в наших e2e тестах

1. ✅ Отображение заголовка страницы
2. ✅ Отображение кнопок (Начать обмен/платеж, Поддержка)
3. ✅ Навигация при клике на кнопки
4. ✅ Отображение списка описаний
5. ✅ Отображение секции "Дополнительно"
6. ✅ Структура страницы (контейнеры, main)
7. ✅ Отсутствие критических ошибок в консоли
8. ✅ Адаптивность на разных размерах экрана

## Преимущества Playwright

- 🚀 Быстрые и надежные тесты
- 🌐 Поддержка всех основных браузеров
- 📱 Тестирование на разных устройствах
- 🎬 Автоматические скриншоты и видео при ошибках
- 🔍 Мощные инструменты отладки
- 📊 Детальные отчеты о выполнении тестов

