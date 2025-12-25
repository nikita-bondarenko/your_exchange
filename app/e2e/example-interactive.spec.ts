import { test, expect } from '@playwright/test';

/**
 * Демонстрационный файл с примерами использования Playwright
 * Этот файл показывает различные возможности Playwright
 */

test.describe('Примеры работы Playwright', () => {
  
  test('Пример 1: Базовый тест - проверка заголовка', async ({ page }) => {
    // Переходим на страницу
    await page.goto('/');
    
    // Ждем загрузки
    await page.waitForLoadState('networkidle');
    
    // Ищем заголовок
    const title = page.locator('h1').first();
    
    // Проверяем, что заголовок виден
    await expect(title).toBeVisible();
    
    // Проверяем, что заголовок содержит текст
    await expect(title).toContainText('Test Change');
  });

  test('Пример 2: Взаимодействие с кнопками', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Находим кнопку поддержки
    const supportButton = page.getByRole('button', { name: 'Поддержка' });
    
    // Проверяем, что кнопка видна и активна
    await expect(supportButton).toBeVisible();
    await expect(supportButton).toBeEnabled();
    
    // Можно кликнуть (закомментировано, чтобы не вызывать реальное действие)
    // await supportButton.click();
  });

  test('Пример 3: Поиск элементов разными способами', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Способ 1: По CSS селектору
    const container = page.locator('.container');
    
    // Способ 2: По роли (лучший способ для доступности)
    const buttons = page.getByRole('button');
    
    // Способ 3: По тексту
    const additionalText = page.getByText('Дополнительно');
    
    // Способ 4: По тегу
    const headings = page.locator('h1, h2, h3');
    
    // Проверяем, что элементы найдены
    await expect(container.first()).toBeVisible();
    await expect(buttons.first()).toBeVisible();
    await expect(additionalText).toBeVisible();
  });

  test('Пример 4: Ожидание элементов', async ({ page }) => {
    await page.goto('/');
    
    // Ждем конкретный элемент
    await page.waitForSelector('h1', { state: 'visible' });
    
    // Ждем загрузки сети
    await page.waitForLoadState('networkidle');
    
    // Ждем загрузки DOM
    await page.waitForLoadState('domcontentloaded');
    
    // Проверяем элемент
    const title = page.locator('h1').first();
    await expect(title).toBeVisible();
  });

  test('Пример 5: Работа с несколькими элементами', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Получаем все кнопки
    const buttons = page.getByRole('button');
    const count = await buttons.count();
    
    // Проверяем, что есть хотя бы одна кнопка
    expect(count).toBeGreaterThan(0);
    
    // Можно пройтись по всем кнопкам
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      await expect(button).toBeVisible();
    }
  });

  test('Пример 6: Проверка текста и атрибутов', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const title = page.locator('h1').first();
    
    // Проверяем видимость
    await expect(title).toBeVisible();
    
    // Проверяем текст (частичное совпадение)
    await expect(title).toContainText('Test');
    
    // Можно проверить точный текст
    // await expect(title).toHaveText('Test Change');
    
    // Можно проверить атрибуты
    // await expect(title).toHaveAttribute('class', /.*/);
  });

  test('Пример 7: Тестирование адаптивности', async ({ page }) => {
    await page.goto('/');
    
    // Мобильный размер
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    const titleMobile = page.locator('h1').first();
    await expect(titleMobile).toBeVisible();
    
    // Планшет
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState('networkidle');
    await expect(titleMobile).toBeVisible();
    
    // Десктоп
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForLoadState('networkidle');
    await expect(titleMobile).toBeVisible();
  });

  test('Пример 8: Отслеживание событий', async ({ page }) => {
    await page.goto('/');
    
    // Собираем ошибки из консоли
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Собираем ошибки страницы
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });
    
    await page.waitForLoadState('networkidle');
    
    // Фильтруем некритичные ошибки
    const criticalErrors = consoleErrors.filter(err => 
      !err.includes('Telegram') && 
      !err.includes('WebApp') &&
      !err.includes('favicon')
    );
    
    // Проверяем отсутствие критических ошибок
    expect(criticalErrors.length).toBeLessThan(10);
    expect(pageErrors.length).toBe(0);
  });

  test('Пример 9: Скриншоты (автоматически при ошибке)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Можно сделать скриншот вручную
    // await page.screenshot({ path: 'screenshot.png', fullPage: true });
    
    // Playwright автоматически делает скриншот при ошибке теста
    const title = page.locator('h1').first();
    await expect(title).toBeVisible();
  });

  test('Пример 10: Навигация и проверка URL', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Проверяем текущий URL
    await expect(page).toHaveURL(/\/$/);
    
    // Можно проверить точный URL
    // await expect(page).toHaveURL('http://localhost:3000/');
    
    // Если бы была навигация, можно было бы проверить:
    // await page.getByRole('button', { name: /Начать обмен/ }).click();
    // await expect(page).toHaveURL(/\/exchange\/type/);
  });
});

