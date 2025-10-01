import { NextRequest } from "next/server";

export const isAllowedOrigin = (request: NextRequest) => {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const protocol = request.nextUrl.protocol;
  const allowedOrigin = `${protocol}://${host}`; // Разрешаем только тот же домен

  console.log(origin, allowedOrigin)
  return origin === allowedOrigin;
};
