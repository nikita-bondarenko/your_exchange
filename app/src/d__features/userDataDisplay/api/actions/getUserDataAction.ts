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

export async function getUserDataAction(
  payload: UserListApiArg
): Promise<UserListApiResponse> {
  const userId = payload.userId;

  const fetchApiProps: FetchApiProps = {
    path: "/user",
    params: {
      user_id: userId,
    },
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetchApi<UserListApiResponse>(fetchApiProps);
  return res;
}
