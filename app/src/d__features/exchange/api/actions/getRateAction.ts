'use server'

import { FetchApiProps, fetchApi } from "@/shared/lib/serverAction";
import { RateListApiArg, RateListApiResponse } from "@/shared/model/api";

export async function getRateAction(
  params?: RateListApiArg
): Promise<RateListApiResponse> {
  const props: FetchApiProps = {
    path: "/rate",
    params,
    method: "GET",
      timeoutMs: 60000,
  };
  return await fetchApi<RateListApiResponse>(props);
}