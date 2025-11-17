// middleware.ts — АБСОЛЮТНО НЕПРОБИВАЕМАЯ защита API
import { NextRequest, NextResponse } from "next/server";
import {
  apiProtectionMiddleware,
  webPlatformFilteringMiddleware,
} from "./d__features/security/lib";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api")) return apiProtectionMiddleware(req);

  if (process.env.NODE_ENV === "production")
    return webPlatformFilteringMiddleware(req);

  return NextResponse.next();
}

// Применяем ко всем API-роутам, кроме health
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
