// app/actions.ts
"use server"; // ← Обязательно! Делает все функции внутри серверными

import {
  fetchApi,
  FetchApiProps,
} from "@/d__features/apiProxy/lib";
import {
  UserListApiResponse,
} from "@/shared/model/api";
import { revalidatePath } from "next/cache";

type Payload = {
  userId: number;
};

export async function getUserDataAction(
  payload: Payload
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
