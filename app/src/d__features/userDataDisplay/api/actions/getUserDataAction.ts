// app/actions.ts
"use server"; // ← Обязательно! Делает все функции внутри серверными

import {
  fetchApi,
  FetchApiProps,
} from "@/shared/lib/serverAction";
import {
  UserListApiArg,
  UserListApiResponse,
} from "@/shared/model/api";
import { authenticateUser } from "@/d__features/userDataDisplay/lib/telegramAuth";
import { PROJECT_NAME } from "@/shared/config";

export async function getUserDataAction(
  payload: UserListApiArg & { initData: string }
): Promise<UserListApiResponse> {
  const { userId, initData } = payload;

    if (PROJECT_NAME === 'test') {
      if (!initData) {
        throw new Error("Telegram WebApp initData required");
      }
  
      const authUserId = await authenticateUser(initData);
      if (authUserId !== userId) {
        throw new Error("User ID mismatch");
      }
    }

  const fetchApiProps: FetchApiProps = {
    path: "/user",
    params: {
      user_id: userId,
    },
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-telegram-init-data": initData,
    },
  };

  const res = await fetchApi<UserListApiResponse>(fetchApiProps);
  return res;
}
