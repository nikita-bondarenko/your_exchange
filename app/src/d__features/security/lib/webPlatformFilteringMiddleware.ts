import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
const BOT_TOKEN = "8289356036:AAH4R1Ie2XA_PsGc37oTWoWKO4RqkMRX5qc";

export const webPlatformFilteringMiddleware = (req: NextRequest) => {
  const initData = req.headers.get("X-Telegram-InitData"); // Или из query: request.nextUrl.searchParams.get('init_data')

  // Замените на ваш BOT_TOKEN
  const ua = req?.headers?.get("user-agent") || "";
  const isTelegramWebView = ua.toLowerCase().includes("telegram");

  console.log("ua", ua);

  if (!initData) return false;

  // Парсим initData (URL-encoded key=value&...)
  const params = new URLSearchParams(initData);
  const hash = params.get("hash") || "";
  params.delete("hash");

  // Сортируем параметры
  const dataCheckArr = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`);

  const dataCheckString = dataCheckArr.join("\n");

  // Секретный ключ: HMAC от botToken с 'WebAppData'
  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(BOT_TOKEN)
    .digest();

  // Вычисляем хэш
  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  // Проверяем совпадение и свежесть (auth_date < 24h)
  const authDate = parseInt(params.get("auth_date") || "0", 10);
  const isFresh = Date.now() / 1000 - authDate < 86400; // 24 часа

  const isTelegramInitDataValid = computedHash === hash && isFresh;

  console.log("isFresh", isFresh);
  console.log("hash", hash);
  console.log("computedHash", computedHash);

  console.log("isTelegramInitDataValid", isTelegramInitDataValid);

  console.log("isTelegramInitDataValid", isTelegramInitDataValid);

  // Замените на ваш BOT_TOKEN

  //   if (!validateTelegramInitData(initData || '', BOT_TOKEN)) {
  //     // Не из Telegram — реврайт на ошибку или редирект
  //     // return NextResponse.rewrite(new URL('/error-not-in-telegram', request.url));
  //   }

  if (!isTelegramWebView) {
    // Redirect or rewrite to an error page if opened in a regular browser
    // return forbiddenResponse;
  }

  // Proceed normally if in Telegram WebView
  return NextResponse.next();
};
