'use server'

import { FetchApiProps, fetchApi } from "@/d__features/apiProxy/lib";
import { CurrenciesResponse } from "@/shared/model/api";

export async function getCurrenciesAction(
  transfer_option_id: number
): Promise<CurrenciesResponse> {
  const props: FetchApiProps = {
    path: "/api/transfer-abroad/currencies",
    params: { transfer_option_id },
    method: "GET",
  };

  return await fetchApi<CurrenciesResponse>(props);
}