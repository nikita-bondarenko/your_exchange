'use server'

import { FetchApiProps, fetchApi } from "@/shared/lib/serverAction";
import { CreateSessionArg, CreateSessionResponse } from "../../model";

export async function createTrackingSessionAction(
  params: CreateSessionArg
): Promise<CreateSessionResponse> {
  const props: FetchApiProps = {
    path: "/user/tracking/session",
    method: "GET",
    params,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return await fetchApi<CreateSessionResponse>(props);
}