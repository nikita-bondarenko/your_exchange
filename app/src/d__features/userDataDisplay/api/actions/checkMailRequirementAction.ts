"use server"

import { FetchApiProps, fetchApi } from "@/d__features/apiProxy/lib";
import {  CheckMailApiArg, CheckMailApiResponse } from "@/shared/model/api";

export async function checkMailRequirementAction(
  payload: CheckMailApiArg
): Promise<CheckMailApiResponse> {
  const fetchApiProps: FetchApiProps = {
    path: "/user/check-mail/",
    params: { user_id: payload.user_id },
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetchApi<CheckMailApiResponse>(fetchApiProps);
  return res;
}