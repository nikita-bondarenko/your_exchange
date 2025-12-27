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
        const cookies = JSON.parse(fs.readFileSync(authFile, 'utf-8'));
        await context.addCookies(cookies);
      } catch (error) {
        console.warn('Failed to load saved auth state:', error);
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

    // Переходим на Telegram Web
    // Используем 'load' вместо 'networkidle', так как Telegram Web может долго загружать ресурсы
    console.log('🌐 Переход на Telegram Web...');
    try {
      await page.goto('https://web.telegram.org/k/', { 
        waitUntil: 'load',
        timeout: 60000 
      });
      console.log('✅ Telegram Web загружен');
    } catch (error) {
      console.warn('⚠️ Таймаут при загрузке, но продолжаем...');
      // Продолжаем даже если был таймаут
    }
    
    // Даем время на загрузку
    await page.waitForTimeout(3000);
    
    // Проверяем, авторизованы ли мы
    console.log('🔍 Проверка авторизации...');
    const isLoggedIn = await page.locator('text=Messages, text=Сообщения').first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);
    
    if (!isLoggedIn) {
      // Проверяем альтернативные индикаторы авторизации
      const alternativeIndicators = [
        page.locator('text=Chats, text=Чаты').first(),
        page.locator('[data-testid="chat-list"]').first(),
        page.locator('.chat-list').first(),
      ];
      
      for (const indicator of alternativeIndicators) {
        if (await indicator.isVisible({ timeout: 2000 }).catch(() => false)) {
          console.log('✅ Авторизован (найден альтернативный индикатор)');
          break;
        }
      }
      
      // Если все еще не авторизованы, ждем авторизации
      const needsAuth = !await page.locator('canvas, [data-testid="auth-qr-code"], input[type="tel"], input[type="text"]').first()
        .isVisible({ timeout: 5000 })
        .catch(() => false);
      
      if (needsAuth) {
        // Ждем QR-код или форму авторизации
        console.log('⚠️ Ожидание авторизации в Telegram Web...');
        console.log('Пожалуйста, отсканируйте QR-код или войдите в аккаунт');
        
        // Ждем появления элементов авторизации
        await page.waitForSelector('canvas, [data-testid="auth-qr-code"], input[type="tel"], input[type="text"]', { 
          timeout: 60000 
        });
        
        // Ждем завершения авторизации (появление Messages или Chats)
        await page.waitForSelector('text=Messages, text=Сообщения, text=Chats, text=Чаты', { 
          timeout: 300000 // До 5 минут на авторизацию
        });
        
        console.log('✅ Авторизация успешна!');
      }
    } else {
      console.log('✅ Уже авторизован');
    }

    // Сохраняем состояние авторизации
    const cookies = await context.cookies();
    fs.writeFileSync(authFile, JSON.stringify(cookies, null, 2));
    console.log('💾 Состояние авторизации сохранено');

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

