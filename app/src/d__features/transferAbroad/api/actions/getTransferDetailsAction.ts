'use server'

import { FetchApiProps, fetchApi } from "@/d__features/apiProxy/lib";
import { TransferDetailsResponse } from "@/shared/model/api";

export async function getTransferDetailsAction(
  payload: { currency_id: number; transfer_option_id: number }
): Promise<TransferDetailsResponse> {
  const props: FetchApiProps = {
    path: "/api/transfer-abroad/currencies/transfer-details",
    params: {
      currency_id: payload.currency_id,
      transfer_option_id: payload.transfer_option_id,
    },
    method: "GET",
  };

  return await fetchApi<TransferDetailsResponse>(props);
}