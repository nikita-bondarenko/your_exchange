'use server'

import { FetchApiProps, fetchApi } from "@/d__features/apiProxy/lib";
import { AbroadCardOrderBody, OrderResponse } from "@/shared/model/api";

export async function createAbroadCardOrderAction(
  payload: AbroadCardOrderBody
): Promise<OrderResponse> {
  const props: FetchApiProps = {
    path: "/api/transfer-abroad/order/abroad-cards",
    method: "POST",
    body: payload,
    headers: { "Content-Type": "application/json" },
  };

  return await fetchApi<OrderResponse>(props);
}