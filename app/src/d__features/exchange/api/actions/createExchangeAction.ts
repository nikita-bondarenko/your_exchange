'use server'

import { FetchApiProps, fetchApi } from "@/shared/lib/serverAction";
import { ExchangesCreateApiArg, ExchangesCreateApiResponse } from "@/shared/model/api";
import { authenticateUser } from "@/d__features/userDataDisplay/lib/telegramAuth";

type PayloadWithInitData = ExchangesCreateApiArg & { initData: string };

export async function createExchangeAction(
  payload: PayloadWithInitData
): Promise<ExchangesCreateApiResponse> {
  const { initData, user_id, ...rest } = payload;

  if (!initData) {
    throw new Error("Telegram WebApp initData required");
  }

  const authUserId = await authenticateUser(initData);
  if (authUserId !== user_id) {
    throw new Error("User ID mismatch");
  }

  const props: FetchApiProps = {
    path: "/exchange",
    method: "POST",
    body: { user_id, ...rest },
    headers: { "Content-Type": "application/json", "x-telegram-init-data": initData },
  };
  return await fetchApi<ExchangesCreateApiResponse>(props);
}
