'use server'

import { FetchApiProps, fetchApi } from "@/d__features/apiProxy/lib";
import { FaqsListApiResponse } from "@/shared/model/api";

export async function getFaqsAction(): Promise<FaqsListApiResponse> {
  const props: FetchApiProps = { path: "/api/faqs", method: "GET" };
  return await fetchApi<FaqsListApiResponse>(props);
}