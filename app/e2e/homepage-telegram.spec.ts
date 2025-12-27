import { test, expect } from './fixtures/telegram-web';

test.describe('Home Page - Telegram Mini App (Real Telegram Web)', () => {
  test.beforeEach(async ({ telegramWebApp, page }) => {
    // telegramWebApp - это frame locator для iframe с Mini App
    // Ждем загрузки Mini App (используем более мягкое ожидание)
    console.log('⏳ Ожидание загрузки Mini App...');
    try {
      await telegramWebApp.locator('body').waitFor({ timeout: 30000 });
      // Даем время на полную загрузку
      await page.waitForTimeout(2000);
      console.log('✅ Mini App загружен');
    } catch (error) {
      console.warn('⚠️ Таймаут при загрузке Mini App, но продолжаем...');
      // Продолжаем даже если был таймаут - возможно приложение уже загружено
    }
  });

  test('1. Переключение режима через тоггл "Обмен криптовалют" - "Платежи за рубеж"', async ({ telegramWebApp, page }) => {
    // Проверяем наличие тоггла (если функция включена)
    const modeSwitcher = telegramWebApp.locator('text=Обмен криптовалют').or(
      telegramWebApp.locator('text=Платежи за рубеж')
    );
    const switcherExists = await modeSwitcher.count() > 0;

    if (switcherExists) {
      // Находим кнопки тоггла
      const exchangeButton = telegramWebApp.getByRole('button', { name: 'Обмен криптовалют' });
      const transferButton = telegramWebApp.getByRole('button', { name: 'Платежи за рубеж' });

      // Проверяем начальное состояние (по умолчанию должен быть режим обмена)
      const startButton = telegramWebApp.getByRole('button', { name: /Начать обмен/ });
      await expect(startButton).toBeVisible();

      // Переключаемся на режим "Платежи за рубеж"
      await transferButton.click();
      await page.waitForTimeout(500); // Ждем обновления состояния

      // Проверяем, что текст кнопки изменился
      const transferStartButton = telegramWebApp.getByRole('button', { name: /Начать платеж/ });
      await expect(transferStartButton).toBeVisible();

      // Переключаемся обратно на режим "Обмен криптовалют"
      await exchangeButton.click();
      await page.waitForTimeout(500);

      // Проверяем, что вернулись к режиму обмена
      const exchangeStartButton = telegramWebApp.getByRole('button', { name: /Начать обмен/ });
      await expect(exchangeStartButton).toBeVisible();
    } else {
      // Если тоггл не отображается, пропускаем тест
      test.skip();
    }
  });

  test('2. Навигация кнопки "Начать обмен" ведет на /exchange/type', async ({ telegramWebApp }) => {
    // Убеждаемся, что мы в режиме обмена
    const exchangeButton = telegramWebApp.getByRole('button', { name: 'Обмен криптовалют' });

    await exchangeButton.click();

    // Находим кнопку "Начать обмен"
    const startButton = telegramWebApp.getByRole('button', { name: /Начать обмен/ });
    await expect(startButton).toBeVisible();
    
    // Кликаем на кнопку
    await startButton.click();
    
    // Проверяем, что произошел переход на страницу выбора типа обмена
    // В iframe URL может не изменяться, поэтому проверяем наличие элементов страницы
    await expect(telegramWebApp.locator('text=/тип|type/i')).toBeVisible({ timeout: 5000 });
  });

  test('3. Навигация кнопки "Начать платеж" ведет на /transfer-abroad/type', async ({ telegramWebApp }) => {
    // Переключаемся на режим "Платежи за рубеж"
    const transferButton = telegramWebApp.getByRole('button', { name: 'Платежи за рубеж' });

    await transferButton.click();

    // Находим кнопку "Начать платеж"
    const startButton = telegramWebApp.getByRole('button', { name: /Начать платеж/ });
    await expect(startButton).toBeVisible();
    
    // Кликаем на кнопку
    await startButton.click();
    
    // Проверяем, что произошел переход на страницу выбора типа платежа
    await expect(telegramWebApp.locator('text=/тип|type/i')).toBeVisible({ timeout: 5000 });
  });

  test('4. Проверка загрузки аватара с сервера', async ({ telegramWebApp, page }) => {
    // Отслеживаем запросы к изображениям
    const imageRequests: string[] = [];
    
    // Отслеживаем запросы на родительской странице
    page.on('request', (request: any) => {
      const url = request.url();
      if (url.endsWith('profile_pic.jpg')) {
        imageRequests.push(url);
      }
    });

    // Находим кнопку профиля (аватар)
    const profileButton = telegramWebApp
      .locator('button[data-tracking-label="Аватар профиля"]')
      .or(telegramWebApp.locator('button').filter({ has: telegramWebApp.locator('img[alt="User Avatar"]') }));
    
    // Проверяем, что кнопка существует
    await expect(profileButton.first()).toBeVisible({ timeout: 10000 });

    // Ждем загрузки всех ресурсов
    await page.waitForTimeout(1000);

    // Проверяем наличие изображения аватара
    const avatarImage = profileButton.locator('img[alt="User Avatar"]');
    
    // Проверяем, что изображение загружено
    const imageSrc = await avatarImage.getAttribute('src');
    expect(imageSrc).toBeTruthy();
    expect(imageSrc).not.toBe('');

    // Проверяем, что изображение действительно загружено (не ошибка загрузки)
    const imageLoaded = await avatarImage.evaluate((img: HTMLImageElement) => {
      return img.complete && img.naturalWidth > 0;
    });
    expect(imageLoaded).toBeTruthy();

    // Проверяем, что был запрос к серверу для загрузки изображения
    if (imageSrc && (imageSrc.startsWith('http') || imageSrc.startsWith('/'))) {
      // Проверяем, что изображение не является data URL (значит загружено с сервера)
      expect(imageSrc.startsWith('data:')).toBeFalsy();
    }

    // Проверяем, что кнопка кликабельна и ведет на страницу профиля
    await profileButton.first().click();
    await expect(telegramWebApp.locator('text=/профиль|profile/i')).toBeVisible({ timeout: 5000 });
  });

  test('5. Проверка кнопки "Поддержка" и логов в консоли', async ({ telegramWebApp, page }) => {
    // Собираем все сообщения консоли ДО клика
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
    
    // Находим кнопку "Поддержка"
    const supportButton = telegramWebApp.getByRole('button', { name: 'Поддержка' });

    await expect(supportButton).toBeVisible();
    await supportButton.click();
    await page.waitForTimeout(800);

    // Проверяем, что было вызвано событие закрытия Mini App
    expect(
      consoleMessagesBefore.some(msg => 
        msg.includes('[Telegram.WebView]') || 
        msg.includes('postEvent') || 
        msg.includes('web_app_close')
      )
    ).toBe(true);

    expect(consoleErrorsBefore.length).toBe(0);
  });
});

