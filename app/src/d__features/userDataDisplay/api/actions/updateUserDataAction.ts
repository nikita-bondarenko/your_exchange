"use server"

import { FetchApiProps, fetchApi } from "@/shared/lib/serverAction";
import { UserUpdateCreateApiArg, UserUpdateCreateApiResponse } from "@/shared/model/api";

export async function updateUserDataAction(
  payload: UserUpdateCreateApiArg
): Promise<UserUpdateCreateApiResponse> {
  const fetchApiProps: FetchApiProps = {
    path: "/user/update",
    method: "POST",
    body: payload,
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetchApi<UserUpdateCreateApiResponse>(fetchApiProps);
  return res;
}