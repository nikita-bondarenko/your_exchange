"use server"

import { FetchApiProps, fetchApi } from "@/shared/lib/serverAction";
import { UserUpdateCreateApiArg, UserUpdateCreateApiResponse } from "@/shared/model/api";
import { authenticateUser } from "@/d__features/userDataDisplay/lib/telegramAuth";

export async function updateUserDataAction(
  payload: UserUpdateCreateApiArg
): Promise<UserUpdateCreateApiResponse> {
  const { initData, user_id, ...rest } = payload;

  if (!initData) {
    throw new Error("Telegram WebApp initData required");
  }

  const authUserId = await authenticateUser(initData);
  if (authUserId !== user_id) {
    throw new Error("User ID mismatch");
  }

  const fetchApiProps: FetchApiProps = {
    path: "/user/update",
    method: "POST",
    body: { user_id, ...rest },
    headers: {
      "Content-Type": "application/json",
      "x-telegram-init-data": initData,
    },
  };

  const res = await fetchApi<UserUpdateCreateApiResponse>(fetchApiProps);
  return res;
}
