'use server'

import { FetchApiProps, fetchApi } from "@/d__features/apiProxy/lib";
import { CheckPromocodeApiArg, CheckPromocodeApiResponse } from "@/shared/model/api";

export async function checkPromocodeAction(
  code: CheckPromocodeApiArg["code"]
): Promise<CheckPromocodeApiResponse> {
  const props: FetchApiProps = {
    path: "/api/check-promo-code",
    params: { code },
    method: "GET",
  };
  return await fetchApi<CheckPromocodeApiResponse>(props);
}