'use server'

import { FetchApiProps, fetchApi } from "@/d__features/apiProxy/lib";
import { RateListApiArg, RateListApiResponse } from "@/shared/model/api";

export async function getRateAction(
  params?: RateListApiArg
): Promise<RateListApiResponse> {
  const props: FetchApiProps = {
    path: "/rate",
    params,
    method: "GET",
  };
  return await fetchApi<RateListApiResponse>(props);
}