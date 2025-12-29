/**
 * Утилита для экспорта состояния авторизации Telegram Web из браузера
 * 
 * Инструкция:
 * 1. Откройте https://web.telegram.org/k/ в браузере
 * 2. Авторизуйтесь
 * 3. Откройте консоль браузера (F12)
 * 4. Скопируйте и выполните этот скрипт
 * 5. Скопируйте вывод и сохраните в app/e2e/.auth/telegram-web.json
 */

(function() {
  // Получаем cookies
  const cookies = document.cookie.split(';').map(cookie => {
    const [name, value] = cookie.trim().split('=');
    return {
      name: name,
      value: value || '',
      domain: '.telegram.org',
      path: '/',
      expires: -1,
      httpOnly: false,
      secure: true,
      sameSite: 'Lax'
    };
  }).filter(c => c.name);

  // Получаем localStorage
  const localStorage = {};
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key) {
      localStorage[key] = window.localStorage.getItem(key);
    }
  }

  // Формируем объект для сохранения
  const authData = {
    cookies: cookies,
    localStorage: localStorage,
    savedAt: new Date().toISOString(),
    exportedFrom: 'browser'
  };

  // Выводим JSON
  console.log('=== Скопируйте этот JSON и сохраните в app/e2e/.auth/telegram-web.json ===');
  console.log(JSON.stringify(authData, null, 2));
  console.log('=== Конец JSON ===');
  
  // Также копируем в буфер обмена (если доступно)
  if (navigator.clipboard) {
    navigator.clipboard.writeText(JSON.stringify(authData, null, 2)).then(() => {
      console.log('✅ JSON скопирован в буфер обмена!');
    }).catch(() => {
      console.log('⚠️ Не удалось скопировать в буфер обмена, скопируйте вручную');
    });
  }
  
  return authData;
})();

