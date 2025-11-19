"use server";
import { FetchApiProps, fetchApi } from "@/d__features/apiProxy/lib";
import {
  CheckConsentApiArg,
  CheckConsentApiResponse,
} from "@/shared/model/api";

export async function checkConsentRequirementAction(
  payload: CheckConsentApiArg
): Promise<CheckConsentApiResponse> {
  const fetchApiProps: FetchApiProps = {
    path: "/user/check-consent/",
    params: { user_id: payload.user_id },
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetchApi<CheckConsentApiResponse>(fetchApiProps);
  return res;
}
