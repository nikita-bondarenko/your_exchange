'use server'

import { FetchApiProps, fetchApi } from "@/shared/lib/serverAction";
import { CreateSessionArg, CreateSessionResponse } from "../../model";

export async function createTrackingSessionAction(
  body: CreateSessionArg
): Promise<CreateSessionResponse> {
  const props: FetchApiProps = {
    path: "/user/tracking/session",
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return await fetchApi<CreateSessionResponse>(props);
}