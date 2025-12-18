'use server'

import { FetchApiProps, fetchApi } from "@/shared/lib/serverAction";
import { CreateSessionArg, CreateSessionResponse } from "../../model";
import { authenticateUser } from "@/d__features/userDataDisplay/lib/telegramAuth";

export async function createTrackingSessionAction(
  body: CreateSessionArg
): Promise<CreateSessionResponse> {
  const { initData, user_id } = body;

  if (!initData) {
    throw new Error("Telegram WebApp initData required");
  }

  const authUserId = await authenticateUser(initData);
  if (authUserId !== user_id) {
    throw new Error("User ID mismatch");
  }

  const props: FetchApiProps = {
    path: "/user/tracking/session",
    method: "POST",
    body: { user_id },
    headers: {
      "Content-Type": "application/json",
      "x-telegram-init-data": initData,
    },
  };
  return await fetchApi<CreateSessionResponse>(props);
}
