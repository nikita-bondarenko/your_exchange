import { test, expect } from '@playwright/test';

test.describe('Home Page - Главная страница', () => {
  test.setTimeout(240000); // Устанавливаем таймаут 2 минуты для всех тестов

  test.beforeEach(async ({ page }) => {
    // Переходим на главную страницу
    await page.goto('http://localhost:3000/');
    // Ждем полной загрузки страницы
    await page.waitForLoadState('networkidle');
  });

  test('1. Переключение режима через тоггл "Обмен криптовалют" - "Платежи за рубеж"', async ({ page }) => {

    // Проверяем наличие тоггла (если функция включена)d
    const modeSwitcher = page.locator('text=Обмен криптовалют').or(page.locator('text=Платежи за рубеж'));
    const switcherExists = await modeSwitcher.count() > 0;

    if (switcherExists) {
      // Находим кнопки тоггла
      const exchangeButton = page.getByRole('button', { name: 'Обмен криптовалют' });
      const transferButton = page.getByRole('button', { name: 'Платежи за рубеж' });

      // Проверяем начальное состояние (по умолчанию должен быть режим обмена)
      const startButton = page.getByRole('button', { name: /Начать обмен/ });
      await expect(startButton).toBeVisible();

      // Переключаемся на режим "Платежи за рубеж"
      await transferButton.click();
      await page.waitForTimeout(500); // Ждем обновления состояния

      // Проверяем, что текст кнопки изменился
      const transferStartButton = page.getByRole('button', { name: /Начать платеж/ });
      await expect(transferStartButton).toBeVisible();

      // Переключаемся обратно на режим "Обмен криптовалют"
      await exchangeButton.click();
      await page.waitForTimeout(500);

      // Проверяем, что вернулись к режиму обмена
      const exchangeStartButton = page.getByRole('button', { name: /Начать обмен/ });
      await expect(exchangeStartButton).toBeVisible();
    } else {
      // Если тоггл не отображается, пропускаем тест
      test.skip();
    }
  });

  test('2. Навигация кнопки "Начать обмен" ведет на /exchange/type', async ({ page }) => {
    // Убеждаемся, что мы в режиме обмена
    const exchangeButton = page.getByRole('button', { name: 'Обмен криптовалют' });

    exchangeButton.click()

    // Находим кнопку "Начать обмен"
    const startButton = page.getByRole('button', { name: /Начать обмен/ });
    await expect(startButton).toBeVisible()
      // Кликаем на кнопку
      await startButton.click();
      
      // Проверяем, что произошел переход на страницу выбора типа обмена
      await page.waitForURL(/\/exchange\/type/, { timeout: 30000 });
      expect(page.url()).toContain('/exchange/type');
  
  });

  test('3. Навигация кнопки "Начать платеж" ведет на /transfer-abroad/type', async ({ page }) => {
    // Переключаемся на режим "Платежи за рубеж"
    const exchangeButton = page.getByRole('button', { name: 'Платежи за рубеж' });

    exchangeButton.click()

    // Находим кнопку "Начать обмен"
    const startButton = page.getByRole('button', { name: /Начать платеж/ });
    await expect(startButton).toBeVisible()
      // Кликаем на кнопку
      await startButton.click();
      
      // Проверяем, что произошел переход на страницу выбора типа обмена
      await page.waitForURL('/transfer-abroad/type', { timeout: 30000 });
      expect(page.url()).toContain('/transfer-abroad/type');
  });

  test('4. Проверка загрузки аватара с сервера', async ({ page }) => {


    // Отслеживаем запросы к изображениям
    const imageRequests: string[] = [];
    page.on('request', (request) => {
      const url = request.url();
      if (url.endsWith('profile_pic.jpg')) {
        imageRequests.push(url);
      }
    });

    // Находим кнопку профиля (аватар)
    const profileButton = page.locator('button[data-tracking-label="Аватар профиля"]').or(
      page.locator('button').filter({ has: page.locator('img[alt="User Avatar"]') })
    );
    
    // Проверяем, что кнопка существует
    await expect(profileButton.first()).toBeVisible({ timeout: 10000 });

    // Ждем загрузки всех ресурсов
    await page.waitForLoadState('networkidle');

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
      // (если аватар загружается с сервера)
      if (imageSrc && (imageSrc.startsWith('http') || imageSrc.startsWith('/'))) {
        // Проверяем, что изображение не является data URL (значит загружено с сервера)
        expect(imageSrc.startsWith('data:')).toBeFalsy();
      }
   

    // Проверяем, что кнопка кликабельна и ведет на страницу профиля
    await profileButton.first().click();
    await page.waitForURL(/\/profile/, { timeout: 5000 });
    expect(page.url()).toContain('/profile');
  });

  test('5. Проверка кнопки "Поддержка" и логов в консоли', async ({ page }) => {
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
    const supportButton = page.getByRole('button', { name: 'Поддержка' });

    await expect(supportButton).toBeVisible();
    supportButton.click()
    await page.waitForTimeout(800);

    expect(consoleMessagesBefore.some(msg => msg === '[Telegram.WebView] > postEvent web_app_close {}')).toBe(true)

    expect(consoleErrorsBefore.length).toBe(0)

  });

  test('6. Проверка секции "Дополнительно" и функциональности всех кнопок', async ({ page }) => {
    // Находим секцию "Дополнительно"
    const additionalSection = page.getByText('Дополнительно');
    await expect(additionalSection).toBeVisible({ timeout: 10000 });

    // Проверяем, что секция закрыта изначально
    const profileLinkInitial = page.getByRole('button', { name: 'Профиль' });
   await profileLinkInitial.isHidden()

    // Кликаем на секцию, чтобы открыть список
    await additionalSection.click();
    await page.waitForTimeout(800); // Ждем анимации открытия

    // Проверяем наличие кнопки "Профиль"
    const profileLink = page.getByRole('button', { name: 'Профиль' });
    await profileLink.isVisible({ timeout: 2000 })
      await profileLink.click();
      await page.waitForURL(/\/profile/, { timeout: 5000 });
      expect(page.url()).toContain('/profile');
      
      // Возвращаемся на главную
      const backButton = page.locator('#back-button');
      await backButton.click();
      const additionalSectionAfterReturn = page.getByText('Дополнительно');
      await additionalSectionAfterReturn.click();
      await page.waitForTimeout(800);

    // Проверяем наличие кнопки "Нас часто спрашивают"
    const faqLink = page.getByRole('button', { name: 'Нас часто спрашивают' });
    await faqLink.isVisible({ timeout: 2000 })
      await faqLink.click();
      await page.waitForURL(/\/faq/, { timeout: 5000 });
      expect(page.url()).toContain('/faq');
      
      // Возвращаемся на главную
      const backButtonFaq = page.locator('#back-button');

      await backButtonFaq.click();
      const additionalSectionAfterReturn2 = page.getByText('Дополнительно');
      await additionalSectionAfterReturn2.click();
      await page.waitForTimeout(800);

    // Проверяем наличие кнопки "Соглашение" (может быть не всегда)
    const termsLink = page.getByRole('button', { name: 'Соглашение' });
    await termsLink.isVisible({ timeout: 2000 })

    // Проверяем наличие кнопки "Политика AML" (может быть не всегда)
    const policyLink = page.getByRole('button', { name: 'Политика AML' });
  await policyLink.isVisible({ timeout: 2000 })

    // Проверяем закрытие секции при повторном клике
    const additionalSectionForClose = page.getByText('Дополнительно');
    await additionalSectionForClose.click();
    await page.waitForTimeout(800);
    
    // Проверяем, что кнопки скрыты (секция закрыта)
    // После закрытия кнопки могут быть скрыты через CSS, но элементы остаются в DOM
    const profileLinkAfterClose = page.getByRole('button', { name: 'Профиль' });
  await profileLinkAfterClose.isHidden()
    

  });


});
