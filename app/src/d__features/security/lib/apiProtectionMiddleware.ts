'use server'

import { NextRequest, NextResponse } from "next/server";
import { forbiddenResponse } from "../config/forbiddenResponse";

const PROTECTION_COOKIE_NAME = "api-protection";
const PROTECTION_SECRET = "super-secure-2025";

const OPEN_PATHS = ["/api/health"] as const;

// const OPEN_FOR_COOKIE_PATHS = ["/api/auth/set-protection"] as const;

const PROHIBITED_PATHS = ['/api/user']

export const apiProtectionMiddleware = (req: NextRequest) => {
    const { pathname } = req.nextUrl;

  // ──────────────────────────────────────────────────────────────
  // Заголовки, которые БРАУЗЕР ставит сам и которые НЕЛЬЗЯ подделать
  // ──────────────────────────────────────────────────────────────

    if (OPEN_PATHS.includes(pathname as any)) {
    return NextResponse.next();
  }
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
  const isLegitRequest = areHeadersValid;

  if (!isLegitRequest || PROHIBITED_PATHS.includes(pathname)) {
    return forbiddenResponse;
  }

  return NextResponse.next();
}