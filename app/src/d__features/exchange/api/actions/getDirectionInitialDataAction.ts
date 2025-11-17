'use server'

import { FetchApiProps, fetchApi } from "@/d__features/apiProxy/lib";
import { GetDirectionInitialDataByDirectionTypeApiArg, GetDirectionInitialDataByDirectionTypeApiResponse } from "@/shared/model/api";

export async function getDirectionInitialDataAction(
  directionType: GetDirectionInitialDataByDirectionTypeApiArg["directionType"]
): Promise<GetDirectionInitialDataByDirectionTypeApiResponse> {
  const props: FetchApiProps = {
    path: `/api/direction-initial-data/${directionType}`,
    method: "GET",
  };
  return await fetchApi<GetDirectionInitialDataByDirectionTypeApiResponse>(props);
}