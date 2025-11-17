'use server'

import { FetchApiProps, fetchApi } from "@/d__features/apiProxy/lib";
import { TransferOptionsResponse } from "@/shared/model/api";

export async function getTransferOptionsAction(): Promise<TransferOptionsResponse> {
  const props: FetchApiProps = {
    path: "/api/transfer-abroad/options",
    method: "GET",
  };

  return await fetchApi<TransferOptionsResponse>(props);
}