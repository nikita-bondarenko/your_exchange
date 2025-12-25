# 🎭 Как работает Playwright - Визуальное руководство

## 📋 Содержание
1. [Что делает Playwright](#что-делает-playwright)
2. [Как запустить тесты](#как-запустить-тесты)
3. [Что происходит во время выполнения](#что-происходит-во-время-выполнения)
4. [Примеры использования](#примеры-использования)

---

## 🎯 Что делает Playwright

Playwright автоматизирует браузер, выполняя действия как реальный пользователь:

```
┌─────────────────────────────────────────┐
│  Playwright запускает браузер            │
│  ↓                                        │
│  Открывает Chrome/Firefox/Safari         │
│  ↓                                        │
│  Переходит на http://localhost:3000      │
│  ↓                                        │
│  Выполняет действия (клики, ввод)        │
│  ↓                                        │
│  Проверяет результат                      │
│  ↓                                        │
│  Закрывает браузер                        │
└─────────────────────────────────────────┘
```

---

## 🚀 Как запустить тесты

### Вариант 1: Обычный запуск (headless - без видимого браузера)
```bash
npm run test:e2e
```

**Что происходит:**
- ✅ Автоматически запускается dev сервер (`npm run dev`)
- ✅ Открывается браузер в фоновом режиме
- ✅ Выполняются все тесты
- ✅ Показывается отчет о результатах
- ✅ Браузер закрывается автоматически

### Вариант 2: С видимым браузером (headed)
```bash
npm run test:e2e:headed
```

**Что происходит:**
- ✅ То же самое, но браузер виден на экране
- ✅ Можно наблюдать за выполнением тестов в реальном времени

### Вариант 3: Интерактивный UI режим (рекомендуется для начала)
```bash
npm run test:e2e:ui
```

**Что происходит:**
- ✅ Открывается окно Playwright UI
- ✅ Можно запускать тесты по одному
- ✅ Видны скриншоты и видео
- ✅ Можно отлаживать тесты

### Вариант 4: Режим отладки
```bash
npm run test:e2e:debug
```

**Что происходит:**
- ✅ Открывается Playwright Inspector
- ✅ Можно выполнять тесты пошагово
- ✅ Можно видеть состояние страницы на каждом шаге

---

## 🔄 Что происходит во время выполнения

### Шаг 1: Подготовка
```
Playwright → Запускает npm run dev
           → Ждет доступности http://localhost:3000
           → Открывает браузер
```

### Шаг 2: Выполнение теста
```
Тест "should display the main page title":
  ↓
  page.goto('/')                    → Переход на главную
  ↓
  page.waitForLoadState('networkidle') → Ожидание загрузки
  ↓
  page.locator('h1').first()       → Поиск заголовка
  ↓
  expect(title).toBeVisible()      → Проверка видимости
  ↓
  ✅ Тест пройден
```

### Шаг 3: Отчет
```
Все тесты выполнены
  ↓
Генерация HTML отчета
  ↓
Сохранение скриншотов (при ошибках)
  ↓
Показ результатов в консоли
```

---

## 💡 Примеры использования

### Пример 1: Простая проверка элемента

```typescript
test('проверка заголовка', async ({ page }) => {
  await page.goto('/');                    // 1. Переход
  await page.waitForLoadState('networkidle'); // 2. Ожидание
  const title = page.locator('h1').first();   // 3. Поиск
  await expect(title).toBeVisible();          // 4. Проверка
});
```

**Визуально:**
```
[Браузер] → [Открывает /] → [Ищет h1] → [Проверяет видимость] → ✅
```

### Пример 2: Взаимодействие с кнопкой

```typescript
test('клик по кнопке', async ({ page }) => {
  await page.goto('/');
  const button = page.getByRole('button', { name: 'Поддержка' });
  await button.click();  // Клик!
  await page.waitForTimeout(1000);  // Ждем реакцию
});
```

**Визуально:**
```
[Браузер] → [Находит кнопку] → [Кликает] → [Ждет 1 сек] → ✅
```

### Пример 3: Проверка навигации

```typescript
test('навигация на другую страницу', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Начать обмен/ }).click();
  await page.waitForURL(/\/exchange\/type/);  // Проверка URL
  expect(page.url()).toContain('/exchange/type');
});
```

**Визуально:**
```
[Браузер] → [Кликает кнопку] → [URL меняется] → [Проверяет URL] → ✅
```

### Пример 4: Тестирование адаптивности

```typescript
test('адаптивность', async ({ page }) => {
  await page.goto('/');
  
  // Мобильный
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(title).toBeVisible();
  
  // Десктоп
  await page.setViewportSize({ width: 1920, height: 1080 });
  await expect(title).toBeVisible();
});
```

**Визуально:**
```
[Браузер] → [375x667] → [Проверка] → [1920x1080] → [Проверка] → ✅
```

---

## 🎬 Реальный пример выполнения

Когда вы запускаете `npm run test:e2e`, вы увидите:

```
Running 9 tests using 3 workers

  ✓ e2e/homepage.spec.ts:5:3 › Home Page › should display the main page title (2.1s)
  ✓ e2e/homepage.spec.ts:17:3 › Home Page › should display the start button (1.8s)
  ✓ e2e/homepage.spec.ts:27:3 › Home Page › should display the support button (1.7s)
  ✓ e2e/homepage.spec.ts:34:3 › Home Page › should navigate to exchange type page (2.3s)
  ✓ e2e/homepage.spec.ts:48:3 › Home Page › should display description list items (1.9s)
  ✓ e2e/homepage.spec.ts:56:3 › Home Page › should display the additional section (2.0s)
  ✓ e2e/homepage.spec.ts:63:3 › Home Page › should have proper page structure (1.8s)
  ✓ e2e/homepage.spec.ts:75:3 › Home Page › should handle button clicks without errors (2.2s)
  ✓ e2e/homepage.spec.ts:105:3 › Home Page › should be responsive (2.5s)

  9 passed (18.3s)
```

---

## 🔍 Полезные команды

### Запустить конкретный тест
```bash
npx playwright test e2e/homepage.spec.ts -g "should display"
```

### Запустить только в Chrome
```bash
npx playwright test --project=chromium
```

### Показать отчет после выполнения
```bash
npx playwright show-report
```

### Установить браузеры (если еще не установлены)
```bash
npx playwright install
```

---

## 📊 Структура файлов

```
app/
├── e2e/                          # E2E тесты
│   ├── homepage.spec.ts          # Тесты главной страницы
│   ├── example-interactive.spec.ts # Примеры использования
│   └── playwright-demo.md         # Документация
├── playwright.config.ts          # Конфигурация Playwright
└── package.json                  # Скрипты для запуска
```

---

## 🎯 Что тестируется в наших тестах

| Тест | Что проверяет |
|------|---------------|
| `should display the main page title` | Заголовок страницы виден |
| `should display the start button` | Кнопка "Начать обмен/платеж" видна |
| `should display the support button` | Кнопка "Поддержка" видна |
| `should navigate to exchange type page` | Навигация работает при клике |
| `should display description list items` | Список описаний отображается |
| `should display the additional section` | Секция "Дополнительно" видна |
| `should have proper page structure` | Структура страницы корректна |
| `should handle button clicks without errors` | Нет ошибок при кликах |
| `should be responsive` | Страница адаптивна |

---

## 💻 Быстрый старт

1. **Установите браузеры** (если еще не установлены):
   ```bash
   npx playwright install
   ```

2. **Запустите тесты в UI режиме** (самый простой способ):
   ```bash
   npm run test:e2e:ui
   ```

3. **Или запустите обычные тесты**:
   ```bash
   npm run test:e2e
   ```

4. **Посмотрите отчет** (после выполнения):
   ```bash
   npx playwright show-report
   ```

---

## 🎓 Дополнительные ресурсы

- [Официальная документация Playwright](https://playwright.dev/)
- [Примеры тестов](e2e/example-interactive.spec.ts)
- [Детальное описание](e2e/playwright-demo.md)

