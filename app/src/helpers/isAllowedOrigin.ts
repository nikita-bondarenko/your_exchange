import { PRODUCTION_ORIGIN } from "@/config";
import { NextRequest } from "next/server";

export const isAllowedOrigin = (request: NextRequest) => {
   const origin = request.headers.get('origin');
  const host = request.headers.get("host");
  const protocol = request.nextUrl.protocol;
  
  const devOrigin = `${protocol}://${host}`;
  const productionOrigin = PRODUCTION_ORIGIN;

  // Текущий origin (для случаев когда запрос с того же домена)
  const currentOrigin = `${protocol}://${host}`;

  console.log("productionOrigin", productionOrigin);
  console.log("devOrigin", devOrigin);
  console.log("origin", origin);
  console.log("currentOrigin", currentOrigin);

  // Разрешаем если origin совпадает или запрос с того же origin
  const isAllowed = 
    origin === productionOrigin || 
    origin === devOrigin ||
    (!origin && (currentOrigin === productionOrigin || currentOrigin === devOrigin));

  return isAllowed;
};
