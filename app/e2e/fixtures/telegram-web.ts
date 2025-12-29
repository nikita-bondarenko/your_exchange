import { test as base, expect as baseExpect, type FrameLocator, type Locator } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Расширяем базовый test с fixture для Telegram Web
// telegramWebApp может быть либо FrameLocator (для реального Telegram Web), либо Locator (для обычного режима)
export const test = base.extend<{
  telegramWebApp: FrameLocator | Locator;
}>({
  // Авторизация в Telegram Web и открытие Mini App
  telegramWebApp: async ({ page, context }, use) => {
    const authDir = path.join(__dirname, '../.auth');
    const authFile = path.join(authDir, 'telegram-web.json');
    
    // Создаем директорию для сохранения состояния авторизации
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }
    
    // Если есть сохраненное состояние авторизации, используем его
    if (fs.existsSync(authFile)) {
      try {
        const authData = JSON.parse(fs.readFileSync(authFile, 'utf-8'));
        
        // Сначала переходим на страницу Telegram Web
        console.log('🌐 Переход на Telegram Web для восстановления авторизации...');
        try {
          await page.goto('https://web.telegram.org/k/', { waitUntil: 'domcontentloaded', timeout: 60000 });
        } catch (error) {
          console.warn('⚠️ Таймаут при загрузке, но продолжаем...');
        }
        
        await page.waitForTimeout(2000); // Даем время на загрузку
        
        // Восстанавливаем localStorage ПЕРЕД cookies (важно для Telegram Web)
        if (authData.localStorage && typeof authData.localStorage === 'object') {
          console.log(`📦 Восстановление localStorage (${Object.keys(authData.localStorage).length} элементов)...`);
          
          await page.evaluate((storage: Record<string, string>) => {
            const storageObj = storage;
            for (const key in storageObj) {
              if (storageObj.hasOwnProperty(key)) {
                try {
                  window.localStorage.setItem(key, storageObj[key]);
                } catch (e) {
                  console.warn(`Failed to set localStorage key ${key}:`, e);
                }
              }
            }
          }, authData.localStorage);
          
          console.log(`✅ LocalStorage восстановлен`);
          
          // Перезагружаем страницу после восстановления localStorage
          await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
          await page.waitForTimeout(3000);
        }
        
        // Восстанавливаем cookies, если они есть
        if (authData.cookies && Array.isArray(authData.cookies) && authData.cookies.length > 0) {
          // Устанавливаем cookies для правильного домена
          const cookiesWithDomain = authData.cookies.map((cookie: any) => ({
            ...cookie,
            domain: cookie.domain || '.telegram.org',
            path: cookie.path || '/',
          }));
          await context.addCookies(cookiesWithDomain);
          console.log(`✅ Загружено ${cookiesWithDomain.length} cookies`);
          
          // Перезагружаем страницу после восстановления cookies
          await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
          await page.waitForTimeout(3000);
        }
      } catch (error) {
        console.warn('⚠️ Ошибка при загрузке сохраненного состояния авторизации:', error);
        console.log('   Продолжаем без восстановления...');
      }
    }

    const botUsername = process.env.TELEGRAM_BOT_USERNAME || '';
    const useRealTelegram = process.env.USE_REAL_TELEGRAM === 'true';

    if (!useRealTelegram) {
      // Если не используем реальный Telegram, используем обычный page как frame locator
      // Это позволяет тестам работать без реального Telegram Web
      console.log('ℹ️ USE_REAL_TELEGRAM не установлен. Используется обычный page вместо Telegram Web.');
      console.log('   Для тестирования через реальный Telegram Web установите: USE_REAL_TELEGRAM=true TELEGRAM_BOT_USERNAME=your_bot');
      
      // Переходим на главную страницу приложения
      await page.goto('/', { waitUntil: 'networkidle' });
      
      // Возвращаем page.locator('body') как Locator, который совместим с frame locator API
      const pageLocator = page.locator('body');
      await use(pageLocator);
      return;
    }

    if (!botUsername) {
      throw new Error('TELEGRAM_BOT_USERNAME environment variable is required when USE_REAL_TELEGRAM=true');
    }

    // Если мы еще не на странице Telegram Web (не восстановили авторизацию выше), переходим
    const currentUrl = page.url();
    if (!currentUrl.includes('web.telegram.org')) {
      console.log('🌐 Переход на Telegram Web...');
      console.log('💡 ВАЖНО: Если требуется авторизация, выполните её вручную в браузере');
      console.log('   После авторизации тесты продолжат автоматически');
      
      try {
        await page.goto('https://web.telegram.org/k/', { 
          waitUntil: 'domcontentloaded', // Используем domcontentloaded для более быстрой загрузки
          timeout: 90000 
        });
        console.log('✅ Telegram Web загружен');
      } catch (error) {
        console.warn('⚠️ Таймаут при загрузке, но продолжаем...');
        // Продолжаем даже если был таймаут
      }
      
      // Даем время на загрузку и рендеринг
      await page.waitForTimeout(5000);
    } else {
      console.log('✅ Уже на странице Telegram Web');
    }
    
    // Проверяем, авторизованы ли мы
    console.log('🔍 Проверка авторизации...');
    await page.waitForTimeout(5000); // Даем больше времени на загрузку после восстановления localStorage
    
    // Проверяем через JavaScript, есть ли данные авторизации в localStorage
    const hasAuthData = await page.evaluate(() => {
      return !!(
        window.localStorage.getItem('account1') ||
        window.localStorage.getItem('user_auth') ||
        window.localStorage.getItem('dc')
      );
    });
    
    if (hasAuthData) {
      console.log('✅ Обнаружены данные авторизации в localStorage');
    }
    
    let isLoggedIn = false;
    
    // Пробуем разные способы проверки авторизации
    const authCheckSelectors = [
      'text=Messages',
      'text=Сообщения',
      'text=Chats',
      'text=Чаты',
      '[data-testid="chat-list"]',
      '.chat-list',
      '[class*="ChatList"]',
      '[class*="chat-list"]',
      'div[class*="Chat"]',
      'aside', // Боковая панель с чатами
    ];
    
    console.log('🔍 Проверка элементов авторизации...');
    for (const selector of authCheckSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
          console.log(`✅ Найден индикатор авторизации: ${selector}`);
          isLoggedIn = true;
          break;
        }
      } catch (error) {
        // Продолжаем проверку
      }
    }
    
    // Дополнительная проверка через JavaScript
    if (!isLoggedIn) {
      const jsCheck = await page.evaluate(() => {
        // Проверяем наличие элементов интерфейса Telegram
        const hasChatList = !!document.querySelector('[class*="chat"], [class*="Chat"], aside');
        const hasNoAuthForm = !document.querySelector('canvas, [class*="auth"], [class*="login"]');
        return hasChatList && hasNoAuthForm;
      });
      
      if (jsCheck) {
        console.log('✅ Авторизован (проверка через JavaScript)');
        isLoggedIn = true;
      }
    }
    
    if (!isLoggedIn) {
      console.log('⚠️ Требуется авторизация в Telegram Web');
      console.log('📱 Пожалуйста, авторизуйтесь вручную в открывшемся браузере');
      console.log('   Вы можете использовать QR-код или войти через телефон');
      console.log('   После авторизации тесты продолжат автоматически...');
      
      // Ждем появления элементов авторизации (QR код или форма входа)
      console.log('🔍 Ожидание элементов авторизации...');
      
      // Пробуем найти разные варианты элементов авторизации
      const authSelectors = [
        'canvas', // QR код
        '[data-testid="auth-qr-code"]',
        'input[type="tel"]', // Поле для телефона
        'input[type="text"]',
        'button:has-text("Log in by phone"), button:has-text("Войти по телефону")',
        'button:has-text("Log in"), button:has-text("Войти")',
        '[class*="auth"]',
        '[class*="login"]',
      ];
      
      let authElementFound = false;
      for (const selector of authSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 10000 });
          console.log(`✅ Найден элемент авторизации: ${selector}`);
          authElementFound = true;
          break;
        } catch (error) {
          // Продолжаем поиск
        }
      }
      
      if (!authElementFound) {
        console.warn('⚠️ Элементы авторизации не найдены автоматически');
        console.log('💡 Попробуйте авторизоваться вручную в браузере');
      }
      
      // Если есть кнопка "Войти по телефону", пытаемся нажать на неё
      const phoneLoginButton = page.locator('button')
        .filter({ hasText: /Log in by phone|Войти по телефону|Войти/i })
        .first();
      
      if (await phoneLoginButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('📱 Найдена кнопка входа по телефону, кликаем...');
        try {
          await phoneLoginButton.click();
          await page.waitForTimeout(2000);
          console.log('✅ Кнопка нажата, ожидаем поле для ввода телефона...');
        } catch (error) {
          console.warn('⚠️ Не удалось кликнуть на кнопку входа по телефону:', error);
        }
      }
      
      // Ждем завершения авторизации (появление Messages, Chats или списка чатов)
      console.log('⏳ Ожидание завершения авторизации...');
      console.log('   Это может занять до 5 минут...');
      
      try {
        await page.waitForSelector(
          'text=Messages, text=Сообщения, text=Chats, text=Чаты, [data-testid="chat-list"], [class*="ChatList"]',
          { timeout: 300000 } // До 5 минут на авторизацию
        );
        console.log('✅ Авторизация успешна!');
      } catch (error) {
        console.error('❌ Таймаут ожидания авторизации');
        console.error('💡 Убедитесь, что вы авторизовались в браузере');
        throw new Error('Не удалось авторизоваться в Telegram Web. Пожалуйста, авторизуйтесь вручную и запустите тесты снова.');
      }
    } else {
      console.log('✅ Уже авторизован');
    }

    // Сохраняем состояние авторизации (cookies + localStorage)
    console.log('💾 Сохранение состояния авторизации...');
    const cookies = await context.cookies();
    
    // Получаем localStorage
    const localStorage = await page.evaluate(() => {
      const storage: Record<string, string> = {};
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key) {
          storage[key] = window.localStorage.getItem(key) || '';
        }
      }
      return storage;
    });
    
    // Сохраняем оба в один файл
    const authData = {
      cookies: cookies,
      localStorage: localStorage,
      savedAt: new Date().toISOString(),
    };
    
    fs.writeFileSync(authFile, JSON.stringify(authData, null, 2));
    console.log(`💾 Состояние авторизации сохранено:`);
    console.log(`   - Cookies: ${cookies.length}`);
    console.log(`   - LocalStorage keys: ${Object.keys(localStorage).length}`);

    // Ищем бота по username
    console.log(`🔍 Поиск бота @${botUsername}...`);
    
    // Открываем поиск (может быть кнопка поиска или можно использовать Ctrl+K)
    try {
      const searchButton = page.locator('[data-testid="search"], button[aria-label*="Search"], button[aria-label*="Поиск"], button[aria-label*="search"]').first();
      
      if (await searchButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await searchButton.click();
      } else {
        // Альтернативно используем горячую клавишу
        await page.keyboard.press('Control+K');
        await page.waitForTimeout(500);
      }
    } catch (error) {
      // Если не удалось открыть поиск через кнопку, используем горячую клавишу
      await page.keyboard.press('Control+K');
      await page.waitForTimeout(500);
    }
    
    await page.waitForTimeout(1000);
    
    // Вводим username бота
    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="Поиск"], input[type="search"], input[type="text"]').first();
    await searchInput.waitFor({ state: 'visible', timeout: 5000 });
    await searchInput.fill(`@${botUsername}`);
    await page.waitForTimeout(2000);
    
    // Открываем чат с ботом
    const botChat = page.locator(`text=@${botUsername}`).first();
    await botChat.click({ timeout: 10000 });
    await page.waitForTimeout(2000);

    console.log(`✅ Чат с ботом @${botUsername} открыт`);

    // Стратегия 1: Ищем кнопку "Новый обмен" рядом с полем ввода сообщений
    console.log('🔍 Поиск кнопки "Новый обмен" рядом с полем ввода...');
    let miniAppOpened = false;
    
    // Ищем кнопку "Новый обмен" - она обычно находится рядом с полем ввода сообщений
    // Пробуем разные варианты поиска
    const newExchangeButtonSelectors = [
      // Прямой поиск по тексту
      page.locator('button').filter({ hasText: /Новый обмен|новый обмен/i }).first(),
      // Поиск в области ввода сообщений
      page.locator('.input-area button, .composer button, [class*="input"] button, [class*="composer"] button')
        .filter({ hasText: /Новый обмен|новый обмен/i })
        .first(),
      // Поиск всех кнопок и проверка текста
      page.locator('button').first(),
    ];
    
    for (const selector of newExchangeButtonSelectors) {
      try {
        if (await selector.isVisible({ timeout: 3000 }).catch(() => false)) {
          const buttonText = await selector.textContent().catch(() => '');
          if (buttonText && (buttonText.includes('Новый обмен') || buttonText.includes('новый обмен') || buttonText.trim() === 'Новый обмен')) {
            console.log(`📱 Найдена кнопка "${buttonText.trim()}", кликаем...`);
            await selector.click();
            miniAppOpened = true;
            console.log('✅ Mini App открыт через кнопку "Новый обмен"');
            break;
          }
        }
      } catch (error) {
        // Продолжаем поиск
      }
    }
    
    // Если не нашли по тексту, ищем все кнопки рядом с полем ввода
    if (!miniAppOpened) {
      console.log('🔍 Поиск всех кнопок рядом с полем ввода сообщений...');
      const messageInput = page.locator('textarea[data-testid="message-input-text"], div[contenteditable="true"], textarea[placeholder*="Message"], textarea').first();
      
      if (await messageInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        // Ищем все кнопки на странице и проверяем их текст
        const allButtons = await page.locator('button').all();
        console.log(`📋 Найдено кнопок на странице: ${allButtons.length}`);
        
        for (const button of allButtons) {
          try {
            const buttonText = await button.textContent().catch(() => '');
            const trimmedText = buttonText?.trim() || '';
            console.log(`  Проверяем кнопку: "${trimmedText}"`);
            
            if (trimmedText.includes('Новый обмен') || trimmedText.includes('новый обмен')) {
              console.log(`📱 Найдена кнопка "${trimmedText}", кликаем...`);
              await button.click();
              miniAppOpened = true;
              console.log('✅ Mini App открыт через кнопку "Новый обмен"');
              break;
            }
          } catch (error) {
            // Продолжаем поиск
          }
        }
      }
    }

    // Стратегия 2: Отправляем команду /start и ищем кнопку в ответе
    if (!miniAppOpened) {
      console.log('📤 Отправка команды /start...');
      const messageInput = page.locator('textarea[data-testid="message-input-text"], div[contenteditable="true"], textarea[placeholder*="Message"]').first();
      
      if (await messageInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await messageInput.click();
        await messageInput.fill('/start');
        await page.waitForTimeout(500);
        await page.keyboard.press('Enter');
        console.log('✅ Команда /start отправлена');
        await page.waitForTimeout(3000);
        
        // Ищем кнопку Mini App в ответе бота (может быть несколько вариантов)
        const appButtonSelectors = [
          // Кнопка с текстом
          page.locator('button, a').filter({ hasText: /App|Приложение|Open|Открыть|Launch|Запустить/i }).first(),
          // Кнопка с data-web-app
          page.locator('button[data-web-app], a[data-web-app]').first(),
          // Кнопка с href содержащим web_app
          page.locator('a[href*="web_app"], button[href*="web_app"]').first(),
          // Любая кнопка в последнем сообщении бота
          page.locator('.message:last-child button, .bubble:last-child button').first(),
        ];

        for (const selector of appButtonSelectors) {
          try {
            if (await selector.isVisible({ timeout: 3000 }).catch(() => false)) {
              console.log('📱 Найдена кнопка Mini App в сообщении бота');
              await selector.click();
              miniAppOpened = true;
              console.log('✅ Mini App открыт через команду /start');
              break;
            }
          } catch (error) {
            // Продолжаем поиск
          }
        }
      } else {
        console.warn('⚠️ Не удалось найти поле ввода сообщения');
      }
    }

    // Стратегия 3: Пробуем найти кнопку в существующих сообщениях
    if (!miniAppOpened) {
      console.log('🔍 Поиск кнопки Mini App в существующих сообщениях...');
      const existingAppButton = page.locator('button, a')
        .filter({ hasText: /App|Приложение|Open|Открыть/i })
        .first();
      
      if (await existingAppButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await existingAppButton.click();
        miniAppOpened = true;
        console.log('✅ Mini App открыт через существующую кнопку');
      }
    }

    // Стратегия 4: Пробуем открыть Mini App через прямой URL
    if (!miniAppOpened) {
      console.log('🔗 Попытка открыть Mini App через прямой URL...');
      const miniAppUrl = process.env.MINI_APP_URL || process.env.DOMAIN || 'http://localhost:3000';
      
      // Формируем URL для открытия Mini App через Telegram Web
      // Формат: https://web.telegram.org/k/#{botUsername}?startapp={startParam}
      const telegramWebAppUrl = `https://web.telegram.org/k/#${botUsername}?startapp=${encodeURIComponent(miniAppUrl)}`;
      
      try {
        await page.goto(telegramWebAppUrl, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(3000);
        console.log('✅ Переход на URL Mini App выполнен');
        miniAppOpened = true;
      } catch (error) {
        console.warn('⚠️ Не удалось открыть Mini App через URL:', error);
      }
    }

    if (!miniAppOpened) {
      // Делаем скриншот для отладки
      await page.screenshot({ path: 'telegram-web-debug.png', fullPage: true });
      console.error('❌ Не удалось открыть Mini App');
      console.error('📸 Скриншот сохранен в telegram-web-debug.png');
      console.error('💡 Попробуйте:');
      console.error('   1. Убедитесь, что бот настроен правильно');
      console.error('   2. Проверьте, что Mini App URL настроен в настройках бота');
      console.error('   3. Откройте Mini App вручную в Telegram Web и посмотрите, как это работает');
      throw new Error('Не удалось открыть Mini App. Убедитесь, что бот настроен правильно и имеет кнопку для запуска Mini App. Проверьте скриншот telegram-web-debug.png');
    }

    // Ждем загрузки Mini App в iframe
    console.log('⏳ Ожидание загрузки Mini App...');
    await page.waitForTimeout(5000);
    
    // Ищем iframe с Mini App
    // Telegram Web загружает Mini App в iframe
    console.log('🔍 Поиск iframe с Mini App...');
    
    // Ждем появления iframe (может быть несколько)
    try {
      await page.waitForSelector('iframe', { timeout: 20000 });
    } catch (error) {
      console.error('❌ Iframe не найден за 20 секунд');
      await page.screenshot({ path: 'telegram-web-no-iframe.png', fullPage: true });
      throw new Error('Iframe с Mini App не найден. Проверьте скриншот telegram-web-no-iframe.png');
    }
    
    // Получаем все iframe'ы и находим нужный
    const iframes = await page.locator('iframe').all();
    console.log(`📋 Найдено iframe'ов: ${iframes.length}`);
    
    let targetFrameLocator = null;
    const domain = process.env.DOMAIN || '';
    
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];
      const src = await iframe.getAttribute('src');
      console.log(`  iframe[${i + 1}]: ${src || '(без src)'}`);
      
      // Проверяем, содержит ли iframe наш Mini App
      if (src && (
        src.includes('t.me') || 
        src.includes('telegram') || 
        (domain && src.includes(domain)) ||
        src.includes('web.telegram.org') === false // Исключаем iframe самого Telegram Web
      )) {
        targetFrameLocator = page.frameLocator(`iframe:nth-of-type(${i + 1})`);
        console.log(`✅ Найден подходящий iframe[${i + 1}] с src: ${src}`);
        break;
      }
    }
    
    // Если не нашли по src, используем последний iframe (обычно это и есть Mini App)
    if (!targetFrameLocator && iframes.length > 0) {
      // Пропускаем первый iframe (это может быть iframe самого Telegram Web)
      const lastIndex = iframes.length;
      targetFrameLocator = page.frameLocator(`iframe:nth-of-type(${lastIndex})`);
      const lastSrc = await iframes[iframes.length - 1].getAttribute('src');
      console.log(`⚠️ Используем последний iframe[${lastIndex}] с src: ${lastSrc || '(без src)'}`);
    }

    if (!targetFrameLocator) {
      await page.screenshot({ path: 'telegram-web-no-target-iframe.png', fullPage: true });
      throw new Error('Не удалось найти подходящий iframe для Mini App. Проверьте скриншот telegram-web-no-target-iframe.png');
    }

    console.log('✅ Mini App iframe найден');

    // Ждем загрузки содержимого Mini App
    try {
      await targetFrameLocator.locator('body').waitFor({ timeout: 30000 });
      await targetFrameLocator.locator('body').waitFor({ state: 'visible', timeout: 10000 });
    } catch (error) {
      console.warn('Предупреждение: не удалось дождаться загрузки body в iframe:', error);
    }
    
    console.log('✅ Mini App загружен и готов к тестированию');
    
    await use(targetFrameLocator);
  },
});

export { baseExpect as expect };

