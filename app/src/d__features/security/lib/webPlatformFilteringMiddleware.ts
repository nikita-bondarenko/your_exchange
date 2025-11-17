import { NextRequest, NextResponse } from "next/server";
import { forbiddenResponse } from "../config/forbiddenResponse";

export const webPlatformFilteringMiddleware = (req: NextRequest ) => {
const ua = req?.headers?.get('user-agent') || '';
  const isTelegramWebView = ua.toLowerCase().includes('telegram');

  console.log('ua',ua)

  if (!isTelegramWebView) {
    // Redirect or rewrite to an error page if opened in a regular browser
    // return forbiddenResponse;
  }

  // Proceed normally if in Telegram WebView
  return NextResponse.next();
}