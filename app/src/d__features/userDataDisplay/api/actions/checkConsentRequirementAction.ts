"use server";
import { FetchApiProps, fetchApi } from "@/shared/lib/serverAction";
import {
  CheckConsentApiArg,
  CheckConsentApiResponse,
} from "@/shared/model/api";
import { authenticateUser } from "@/d__features/userDataDisplay/lib/telegramAuth";

export async function checkConsentRequirementAction(
  payload: CheckConsentApiArg
): Promise<CheckConsentApiResponse> {
  const { initData, user_id } = payload;

  if (initData) {
    const authUserId = await authenticateUser(initData);
    if (authUserId !== user_id) {
      throw new Error("User ID mismatch");
    }
  }

  const fetchApiProps: FetchApiProps = {
    path: "/user/check-consent/",
    params: { user_id: payload.user_id },
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(initData ? { "x-telegram-init-data": initData } : {}),
    },
  };

  const res = await fetchApi<CheckConsentApiResponse>(fetchApiProps);
  return res;
}
