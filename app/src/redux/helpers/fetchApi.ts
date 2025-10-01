"use server";

import { API_URL } from "@/config";

export interface FetchError {
  message: string;
  status?: number; // HTTP-статус (например, 400, 401, 500)
  type: "http" | "network" | "json" | "unknown"; // Тип ошибки
}

export type FetchApiProps = {
  path: string;
  method?: string;
  params?: Object;
  body?: Object | null;
  headers?: HeadersInit;
};

export async function fetchApi<T>({
  path,
  method = "GET",
  params,
  body,
  headers,
}: FetchApiProps): Promise<T> {
  const queryString = params
    ? Object.entries(params).reduce(
        (str, [key, value], index) =>
          str + `${index === 0 ? "?" : "&"}${key}=${value}`,
        ""
      )
    : "";

  const finalBody: string = JSON.stringify(body);

  const result = await fetch(`${API_URL}${path}${queryString}`, {
    method,
    ...(method !== "GET" ? { body: finalBody } : {}),
    headers: headers,
  });

  return result.json();
}
