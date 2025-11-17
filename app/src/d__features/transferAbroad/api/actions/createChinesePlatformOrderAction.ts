'use server'

import { FetchApiProps, fetchApi } from "@/d__features/apiProxy/lib";
import { ChinesePlatformOrderBody, OrderResponse } from "@/shared/model/api";


export async function createChinesePlatformOrderAction(
  payload: ChinesePlatformOrderBody
): Promise<OrderResponse> {
  const props: FetchApiProps = {
    path: "/api/transfer-abroad/order/chinese-platforms",
    method: "POST",
    body: payload,
    headers: { "Content-Type": "application/json" },
  };

  return await fetchApi<OrderResponse>(props);
}