import { PRODUCTION_ORIGIN } from "@/config";
import { NextRequest } from "next/server";

export const isAllowedOrigin = (request: NextRequest) => {
  const origin = request.headers.get('origin');
  const host = request.headers.get("host");
  const protocol = request.nextUrl.protocol;
  const devOrigin = `${protocol}://${host}`;
  const productionOrigin = PRODUCTION_ORIGIN;

  console.log("productionOrigin", productionOrigin);
  console.log("devOrigin", devOrigin);
  console.log("origin", origin);

  const isAllowed = origin === productionOrigin || origin === devOrigin;

  return isAllowed;
};
