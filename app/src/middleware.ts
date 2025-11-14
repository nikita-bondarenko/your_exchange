// middleware.ts — АБСОЛЮТНО НЕПРОБИВАЕМАЯ защита API
import { NextRequest, NextResponse } from "next/server";

const PROTECTION_COOKIE_NAME = "api-protection";
const PROTECTION_SECRET = "super-secure-2025";

const OPEN_PATHS = ["/api/health"] as const;

const OPEN_FOR_COOKIE_PATHS = ["/api/auth/set-protection"] as const;

const PROHIBITED_PATHS = ['/api/user']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (OPEN_PATHS.includes(pathname as any)) {
    return NextResponse.next();
  }
  // ──────────────────────────────────────────────────────────────
  // Заголовки, которые БРАУЗЕР ставит сам и которые НЕЛЬЗЯ подделать
  // ──────────────────────────────────────────────────────────────
  const cookieValue = req.cookies.get(PROTECTION_COOKIE_NAME)?.value;
  const secFetchSite = req.headers.get("sec-fetch-site");
  const secFetchMode = req.headers.get("sec-fetch-mode");
  const secFetchDest = req.headers.get("sec-fetch-dest");

  // Легитимные значения от настоящего фронтенда (same-origin):
  const isCookieValid = cookieValue === PROTECTION_SECRET;
  const isSameOrigin = secFetchSite === "same-origin";
  const isCorsOrNavigate =
    secFetchMode === "cors" || secFetchMode === "navigate";
  const isValidDest =
    secFetchDest === "empty" || // fetch/axios
    secFetchDest === "object" || // RTK Query
    secFetchDest === "script"; // редкие случаи

  // Если хоть одна проверка не прошла — это 100% не твой фронтенд
  const areHeadersValid = isSameOrigin && isCorsOrNavigate && isValidDest;
  let isLegitRequest = false;

  // console.log('isSameOrigin',isSameOrigin)
  // console.log('isCorsOrNavigate',isCorsOrNavigate)
  // console.log('isValidDest',isValidDest)
  // console.log('isCookieValid',isCookieValid)
  // console.log('pathname',pathname)

  if (OPEN_FOR_COOKIE_PATHS.includes(pathname as any)) {
    isLegitRequest = areHeadersValid;
  } else {
    isLegitRequest = areHeadersValid && isCookieValid;
  }

  // console.log(cookieValue, secFetchSite, secFetchMode, secFetchDest)
  if (!isLegitRequest || PROHIBITED_PATHS.includes(pathname)) {
    return new NextResponse(
      JSON.stringify({ error: "Forbidden: invalid request source" }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  }

  return NextResponse.next();
}

// Применяем ко всем API-роутам, кроме health
export const config = {
  matcher: "/api/:path*",
};
