'use server'

import { FetchApiProps, fetchApi } from "@/d__features/apiProxy/lib";
import { InvoiceOrderBody, OrderResponse } from "@/shared/model/api";

export async function createInvoiceOrderAction(
  payload: InvoiceOrderBody
): Promise<OrderResponse> {
  const props: FetchApiProps = {
    path: "/api/transfer-abroad/order/invoice",
    method: "POST",
    body: payload,
    headers: { "Content-Type": "application/json" },
  };

  return await fetchApi<OrderResponse>(props);
}