import { test, expect } from '@playwright/test';

test.describe('Profile Page - Страница профиля', () => {
  test.setTimeout(240000); // Устанавливаем таймаут 2 минуты для всех тестов

  test.beforeEach(async ({ page }) => {

    await page.goto('http://localhost:3000/profile');
    // Ждем полной загрузки страницы
    await page.waitForLoadState('networkidle');
  });

  test('1. Проверка работы хедера', async ({ page }) => {
    // Проверяем наличие кнопки "Назад"
  

    // Проверяем наличие названия страницы "Данные профиля"
    const pageName = page.locator('.header__text');
    await expect(pageName).toBeVisible({ timeout: 5000 });
    await expect(pageName).toHaveText('Данные профиля');

    const backButton = page.locator('#back-button');
    await expect(backButton).toBeVisible();

    // Проверяем работу меню
    // Находим кнопку меню (контейнер с классом "flex justify-end relative" содержит кнопку меню)
    const menuContainer = page.locator('#header-menu-container');
    const menuButton = menuContainer.locator('#header-menu-open-button');
    await expect(menuButton).toBeVisible();

    // Проверяем, что меню изначально закрыто (проверяем opacity и pointer-events)
    const menuDropdown = menuContainer.locator('#header-menu-dropdown');
    const menuOpacity = await menuDropdown.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    }).catch(() => '1');
    const isMenuInitiallyOpen = menuOpacity !== '0' && await menuDropdown.isVisible().catch(() => false);
    expect(isMenuInitiallyOpen).toBeFalsy();

    // Открываем меню
    await menuButton.click();
    await page.waitForTimeout(500); // Ждем анимации открытия

    // Проверяем, что меню открылось
    await expect(menuDropdown).toBeVisible({ timeout: 2000 });
    const menuOpacityAfterOpen = await menuDropdown.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });
    expect(parseFloat(menuOpacityAfterOpen)).toBeGreaterThan(0);

    // Проверяем наличие кнопок в меню
    const askQuestionButton = page.getByRole('button', { name: 'Задать вопрос' });
    const reloadPageButton = page.getByRole('button', { name: 'Обновить страницу' });
    

    const consoleMessagesBefore: string[] = [];
    const consoleErrorsBefore: string[] = [];
    
    const messageHandler = (msg: any) => {
      const text = msg.text();
      consoleMessagesBefore.push(text);
      if (msg.type() === 'error') {
        consoleErrorsBefore.push(text);
      }
    };

    page.on('console', messageHandler);

    await expect(askQuestionButton).toBeVisible();
    await askQuestionButton.click();
    await page.waitForTimeout(800);

    // Проверяем, что в консоли появилось событие закрытия WebView
    expect(consoleMessagesBefore.some(msg => msg === '[Telegram.WebView] > postEvent web_app_close {}')).toBe(true);
    
    // Проверяем, что нет ошибок в консоли
    expect(consoleErrorsBefore.length).toBe(0);

    await expect(reloadPageButton).toBeVisible();
    const currentUrl = page.url();

    // Кликаем на кнопку "Обновить страницу"
    await reloadPageButton.click();

    // Ждем перезагрузки страницы
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Проверяем, что страница перезагрузилась (URL остался тем же, но страница обновилась)
    expect(page.url()).toBe(currentUrl);
    // Закрываем меню кликом на кнопку меню
    await pageName.click();
    await page.waitForTimeout(500); // Ждем анимации закрытия

    // Проверяем, что меню закрылось (проверяем opacity)
    const menuOpacityAfterClose = await menuDropdown.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    }).catch((e) => '1');
    expect(parseFloat(menuOpacityAfterClose)).toBe(0);
  });


  test('2. Проверка наличия формы и полей', async ({ page }) => {
    // Проверяем наличие заголовка формы
    const formHeading = page.getByText('Контактная информация');
    await expect(formHeading).toBeVisible();

    // Проверяем наличие поля "ФИО"
    const nameField = page.locator('input[name="name"]');
    await expect(nameField).toBeVisible();
    await expect(nameField).toHaveAttribute('placeholder', 'ФИО');
    await expect(nameField).toHaveAttribute('data-tracking-label', 'ФИО');

    // Проверяем наличие поля "Номер телефона"
    const phoneField = page.locator('input[name="phone"]');
    await expect(phoneField).toBeVisible();
    await expect(phoneField).toHaveAttribute('placeholder', 'Номер телефона');
    await expect(phoneField).toHaveAttribute('data-tracking-label', 'Номер телефона');
    await expect(phoneField).toHaveAttribute('type', 'tel');

    // Проверяем наличие поля "Электронная почта"
    const emailField = page.locator('input[name="email"]');
    await expect(emailField).toBeVisible();
    await expect(emailField).toHaveAttribute('placeholder', 'Электронная почта');
    await expect(emailField).toHaveAttribute('data-tracking-label', 'Электронная почта');
    await expect(emailField).toHaveAttribute('type', 'text');

    // Проверяем наличие кнопки "Сохранить"
    const saveButton = page.getByRole('button', { name: 'Сохранить' });
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toHaveAttribute('data-tracking-label', 'Сохранить');
  });

  test('3. Проверка валидации формы - пустые поля', async ({ page }) => {
    // Очищаем поля формы
    const nameField = page.locator('input[name="name"]');
    const phoneField = page.locator('input[name="phone"]');
    const emailField = page.locator('input[name="email"]');

    await nameField.clear();
    await phoneField.clear();
    await emailField.clear();

    // Пытаемся отправить форму
    const saveButton = page.getByRole('button', { name: 'Сохранить' });
    await saveButton.click();

    // Ждем появления ошибок валидации
    await page.waitForTimeout(500);

    // Проверяем наличие сообщений об ошибках валидации
    const errorTexts = page.locator('p[class*="text-[var(--text-error-light)]"]');
    const errorCount = await errorTexts.count();
    
    // Проверяем, что есть хотя бы одна ошибка валидации
    expect(errorCount).toBeGreaterThan(0);
  });

  test('4. Проверка валидации формы - невалидный email', async ({ page }) => {
    const nameField = page.locator('input[name="name"]');
    const phoneField = page.locator('input[name="phone"]');
    const emailField = page.locator('input[name="email"]');

    // Заполняем поля невалидными данными
    await nameField.fill('Иван Иванов');
    await phoneField.fill('+7 999 123 45 67');
    await emailField.fill('invalid-email'); // Невалидный email

    // Пытаемся отправить форму
    const saveButton = page.getByRole('button', { name: 'Сохранить' });
    await saveButton.click();

    await page.waitForTimeout(500);

    // Проверяем наличие ошибки валидации для email
    // Ищем текст ошибки рядом с полем email
    const emailErrorText = page.locator('input[name="email"]').locator('..').locator('p').filter({ hasText: /Введите корректный email/i });
    const hasEmailError = await emailErrorText.isVisible({ timeout: 1000 }).catch(() => false);
    expect(hasEmailError).toBeTruthy();
  });

  test('5. Проверка валидации формы - невалидное ФИО (одно слово)', async ({ page }) => {
    const nameField = page.locator('input[name="name"]');
    const phoneField = page.locator('input[name="phone"]');
    const emailField = page.locator('input[name="email"]');

    // Заполняем поля
    await nameField.fill('Иван'); // Только одно слово
    await phoneField.fill('+7 999 123 45 67');
    await emailField.fill('test@example.com');

    // Пытаемся отправить форму
    const saveButton = page.getByRole('button', { name: 'Сохранить' });
    await saveButton.click();

    await page.waitForTimeout(500);

    // Проверяем наличие ошибки валидации для имени
    // Ищем текст ошибки "Введите минимум два слова"
    const nameErrorText = page.locator('input[name="name"]').locator('..').locator('p').filter({ hasText: /минимум два слова/i });
    const hasNameError = await nameErrorText.isVisible({ timeout: 1000 }).catch(() => false);
    expect(hasNameError).toBeTruthy();
    await nameField.fill(''); // Только одно слово
    const nameEmptyErrorText = page.locator('input[name="name"]').locator('..').locator('p').filter({ hasText: /обязательно/i });
    const hasNameEmptyError = await nameEmptyErrorText.isVisible({ timeout: 1000 }).catch(() => false);
    expect(hasNameEmptyError).toBeTruthy();

  });

  test('6. Проверка валидации формы - невалидный телефон', async ({ page }) => {
    const nameField = page.locator('input[name="name"]');
    const phoneField = page.locator('input[name="phone"]');
    const emailField = page.locator('input[name="email"]');

    // Заполняем поля
    await nameField.fill('Иван Иванов');
    await phoneField.fill('12345'); // Меньше 11 цифр
    await emailField.fill('test@example.com');

    // Пытаемся отправить форму
    const saveButton = page.getByRole('button', { name: 'Сохранить' });
    await saveButton.click();

    await page.waitForTimeout(500);

    // Проверяем наличие ошибки валидации для телефона
    // Ищем текст ошибки о минимальном количестве цифр
    const phoneLengthErrorText = page.locator('input[name="phone"]').locator('..').locator('p').filter({ hasText: /минимум 11 цифр/i });
    const hasPhoneError = await phoneLengthErrorText.isVisible({ timeout: 1000 }).catch(() => false);
    expect(hasPhoneError).toBeTruthy();

    await phoneField.fill('12345d'); // Меньше 11 цифр
    const phoneTypeErrorText = page.locator('input[name="phone"]').locator('..').locator('p').filter({ hasText: /только цифры/i });
    const hasPhoneTypeError = await phoneTypeErrorText.isVisible({ timeout: 1000 }).catch(() => false);

    expect(hasPhoneTypeError).toBeTruthy();


  });

  test('7. Проверка валидации формы - валидные данные', async ({ page }) => {
    const nameField = page.locator('input[name="name"]');
    const phoneField = page.locator('input[name="phone"]');
    const emailField = page.locator('input[name="email"]');

    // Заполняем поля валидными данными
    await nameField.fill('Иван Иванов');
    await phoneField.fill('+7 999 123 45 67');
    await emailField.fill('test@example.com');

    // Пытаемся отправить форму
    const saveButton = page.getByRole('button', { name: 'Сохранить' });
    await saveButton.click();

    // Ждем обработки формы
    await page.waitForTimeout(1000);

    // Проверяем, что ошибок валидации нет (или появилось уведомление об успехе)
    const successNotification = page.getByText('данные успешно сохранены');
    const hasSuccess = await successNotification.isVisible({ timeout: 3000 }).catch(() => false);
    
    // Проверяем отсутствие ошибок валидации
    const errorTexts = page.locator('p[class*="text-[var(--text-error-light)]"]');
    const visibleErrors = await errorTexts.filter({ hasText: /.+/ }).count();
    
    // Если есть уведомление об успехе или нет видимых ошибок - форма валидна
    expect(hasSuccess || visibleErrors === 0).toBeTruthy();
  });

  test('8. Проверка наличия секции истории обращений', async ({ page }) => {
    // Проверяем наличие заголовка "История обращений"
    const historyHeading = page.getByText('История обращений');
    
    // Секция может быть видна или скрыта в зависимости от наличия данных
    const isHistoryVisible = await historyHeading.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isHistoryVisible) {
      // Если секция видна, проверяем её структуру
      await expect(historyHeading).toBeVisible();
      
      // Проверяем наличие элементов истории (кнопок с заявками)
      const historyItems = page.locator('button[data-tracking-label^="Превью операции: Заявка #"]');
      const itemCount = await historyItems.count();
      expect(itemCount).toBeGreaterThan(0);
    } else {
      // Если секции нет, это тоже нормально - значит нет истории
      expect(isHistoryVisible).toBeFalsy();
    }
  });

  test('9. Проверка работы ссылки на подробную информацию о сделке', async ({ page }) => {
    // Проверяем наличие секции истории
    const historyHeading = page.getByText('История обращений');
    const isHistoryVisible = await historyHeading.isVisible({ timeout: 2000 }).catch(() => false);

    if (isHistoryVisible) {
      // Находим первый элемент истории
      const firstHistoryItem = page.locator('button[data-tracking-label^="Превью операции: Заявка #"]').first();
      await expect(firstHistoryItem).toBeVisible();



      // Получаем tracking label для проверки ID заявки
      const trackingLabel = await firstHistoryItem.getAttribute('data-tracking-label');
      expect(trackingLabel).toBeTruthy();
      expect(trackingLabel).toContain('Превью операции: Заявка #');

      // Кликаем на элемент истории
      await firstHistoryItem.click();

      // Ждем перехода на страницу деталей заявки
      await page.waitForURL(/\/profile\/request/, { timeout: 5000 });
      expect(page.url()).toContain('/profile/request');

      // Ждем полной загрузки страницы и обновления Redux store
      await page.waitForLoadState('networkidle');
      
      // Даем время для обновления Redux store и рендеринга компонентов
      await page.waitForTimeout(500);
      
      // Проверяем, что страница не показывает "Заявка не найдена"
      const notFoundMessage = page.getByText('Заявка не найдена');
      const isNotFoundVisible = await notFoundMessage.isVisible({ timeout: 1000 }).catch(() => false);
      expect(isNotFoundVisible).toBeFalsy();

      // Ждем появления заголовка страницы в хедере
      const pageName = page.locator('.header__text');
      await expect(pageName).toBeVisible({ timeout: 10000 });
      const pageNameText = await pageName.textContent();
      expect(pageNameText).toMatch(/Заявка #\d+/);

      // Ждем появления контейнера с деталями заявки
      const requestDetailsContainer = page.locator('.container.mt-10');
      await expect(requestDetailsContainer).toBeVisible({ timeout: 10000 });

      // Ждем появления секции "Я отдал" - это означает, что данные загрузились
      const iGaveSection = page.getByText('Я отдал');
      await expect(iGaveSection).toBeVisible({ timeout: 10000 });

      // Ждем появления секции "Я получил"
      const iReceivedSection = page.getByText('Я получил');
      await expect(iReceivedSection).toBeVisible({ timeout: 10000 });

      // Ждем появления контейнеров с данными (секций с фоном)
      // Ищем контейнер с фоном (bg-[var(--background-secondary)])
      const allSections = page.locator('div[class*="bg-[var(--background-secondary)]"].rounded-6');
      await expect(allSections.first()).toBeVisible({ timeout: 10000 });
      const sectionsCount = await allSections.count();
      expect(sectionsCount).toBeGreaterThanOrEqual(2); // Должно быть минимум 2 секции

      // Проверяем наличие информации о валюте в секциях
      // В каждой секции должна быть иконка валюты
      const currencyIcons = page.locator('div[class*="bg-[var(--background-secondary)]"] img, div[class*="bg-[var(--background-secondary)]"] svg');
      const iconsCount = await currencyIcons.count();
      expect(iconsCount).toBeGreaterThanOrEqual(2); // Должно быть минимум 2 иконки (по одной в каждой секции)

      // Проверяем наличие суммы валюты в секциях
      // Сумма отображается в span с классом text-21
      const currencyAmounts = page.locator('div[class*="bg-[var(--background-secondary)]"] span[class*="text-21"]');
      const amountsCount = await currencyAmounts.count();
      expect(amountsCount).toBeGreaterThanOrEqual(2); // Должно быть минимум 2 суммы

      // Проверяем наличие названия валюты
      // Название валюты в span с классом text-16
      const currencyNames = page.locator('div[class*="bg-[var(--background-secondary)]"] span[class*="text-16"]');
      const namesCount = await currencyNames.count();
      expect(namesCount).toBeGreaterThanOrEqual(2); // Должно быть минимум 2 названия валют

      // Проверяем наличие типа операции (label)
      // Label отображается в span с классом text-[var(--text-light)]
      const typeLabels = page.locator('div[class*="bg-[var(--background-secondary)]"] span[class*="text-[var(--text-light)]"]');
      const labelsCount = await typeLabels.count();
      expect(labelsCount).toBeGreaterThanOrEqual(2); // Должно быть минимум 2 label

      // Проверяем наличие курса обмена в секции "Я получил"
      // Курс отображается в span с классом text-13 рядом с заголовком секции
      const rateText = iReceivedSection.locator('..').locator('span[class*="text-13"]').filter({ hasText: /=/ });
      const hasRate = await rateText.count() > 0;
      // Курс должен быть в секции "Я получил", если есть данные о курсе
      // Проверяем, что курс содержит знак равенства (формат: "1 BTC = 50000 USD")
      if (hasRate) {
        const rateContent = await rateText.first().textContent();
        expect(rateContent).toContain('=');
      }
      
    } else {
      // Если истории нет, пропускаем тест
      test.skip();
    }
  });

  test('10. Проверка отображения данных в элементах истории', async ({ page }) => {
    // Проверяем наличие секции истории
    const historyHeading = page.getByText('История обращений');
    const isHistoryVisible = await historyHeading.isVisible({ timeout: 2000 }).catch(() => false);

    if (isHistoryVisible) {
      // Находим первый элемент истории
      const firstHistoryItem = page.locator('button[data-tracking-label^="Превью операции: Заявка #"]').first();
      await expect(firstHistoryItem).toBeVisible();

      // Проверяем наличие даты в элементе истории
      const dateElement = firstHistoryItem.locator('span').first();
      const dateText = await dateElement.textContent();
      expect(dateText).toBeTruthy();

      // Проверяем наличие номера заявки
      const requestIdElement = firstHistoryItem.locator('span').nth(1);
      const requestIdText = await requestIdElement.textContent();
      expect(requestIdText).toBeTruthy();
      expect(requestIdText).toMatch(/заявка\s+\d+/i);

      // Проверяем наличие информации о валютах (должны быть иконки или названия)
      const currencyInfo = firstHistoryItem.locator('[class*="grid"]');
      await expect(currencyInfo).toBeVisible();
    } else {
      // Если истории нет, пропускаем тест
      test.skip();
    }
  });
});
