'use server'

import { FetchApiProps, fetchApi } from "@/d__features/apiProxy/lib";
import { PostCallingOperatorApiArg, PostCallingOperatorApiResponse } from "@/shared/model/api";

export async function callOperatorAction(
  payload: PostCallingOperatorApiArg
): Promise<PostCallingOperatorApiResponse> {
  const props: FetchApiProps = {
    path: "/calling-operator",
    method: "POST",
    body: payload,
    headers: { "Content-Type": "application/json" },
  };
  return await fetchApi<PostCallingOperatorApiResponse>(props);
}