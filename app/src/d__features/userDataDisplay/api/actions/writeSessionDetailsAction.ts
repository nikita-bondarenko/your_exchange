"use server";
import { fetchApi, FetchApiProps } from "@/shared/lib/serverAction";
import {
  WriteSessionDetailsArg,
  WriteSessionDetailsResponse,
} from "../../model";

export const writeSessionDetailsAction = async (
  params: WriteSessionDetailsArg
): Promise<WriteSessionDetailsResponse> => {
  const props: FetchApiProps = {
    path: "/user/tracking/action",
    method: "GET",
    params,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return await fetchApi<WriteSessionDetailsResponse>(props);
};
