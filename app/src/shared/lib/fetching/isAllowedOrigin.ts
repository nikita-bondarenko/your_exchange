
import { PRODUCTION_ORIGIN } from "@/shared/config";
import { NextRequest } from "next/server";

export const isAllowedOrigin = (request: NextRequest) => {
  const origin = request.headers.get('origin');
  const host = request.headers.get("host");
  const protocol = request.nextUrl.protocol;
  const devOrigin = `${protocol}://${host}`;
  const productionOrigin = PRODUCTION_ORIGIN;
  const isAllowed = origin === productionOrigin || origin === devOrigin;

  return isAllowed;
};
