'use server'

import { FetchApiProps, fetchApi } from "@/shared/lib/serverAction";
import { ExchangesCreateApiArg, ExchangesCreateApiResponse } from "@/shared/model/api";

export async function createExchangeAction(
  payload: ExchangesCreateApiArg
): Promise<ExchangesCreateApiResponse> {
  const props: FetchApiProps = {
    path: "/exchange",
    method: "POST",
    body: payload,
    headers: { "Content-Type": "application/json" },
  };
  return await fetchApi<ExchangesCreateApiResponse>(props);
}