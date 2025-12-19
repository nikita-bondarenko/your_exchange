"use server"

import { FetchApiProps, fetchApi } from "@/shared/lib/serverAction";
import { CheckMailApiArg, CheckMailApiResponse } from "@/shared/model/api";
import { authenticateUser } from "@/d__features/userDataDisplay/lib/telegramAuth";
import { PROJECT_NAME } from "@/shared/config";

export async function checkMailRequirementAction(
  payload: CheckMailApiArg
): Promise<CheckMailApiResponse> {
  const { initData, user_id } = payload;

   if (PROJECT_NAME === 'test') {
     if (!initData) {
       throw new Error("Telegram WebApp initData required");
     }
 
     const authUserId = await authenticateUser(initData);
     if (authUserId !== user_id) {
       throw new Error("User ID mismatch");
     }
   }

  const fetchApiProps: FetchApiProps = {
    path: "/user/check-mail/",
    params: { user_id: payload.user_id },
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(initData ? { "x-telegram-init-data": initData } : {}),
    },
  };

  const res = await fetchApi<CheckMailApiResponse>(fetchApiProps);
  return res;
}
