"use server";

import { API_URL } from "@/shared/config";


export interface FetchError {
  message: string;
  status?: number; // HTTP-статус (например, 400, 401, 500)
  type: "http" | "network" | "json" | "unknown"; // Тип ошибки
}

export type FetchApiProps = {
  path: string;
  method?: string;
  params?: object;
  body?: object | null;
  headers?: HeadersInit;
};

export async function fetchApi<T>({
  path,
  method = "GET",
  params,
  body,
  headers,
}: FetchApiProps): Promise<T> {
  try {
    const queryString = params
      ? Object.entries(params)
          .reduce(
            (str, [key, value], index) =>
              str + `${index === 0 ? "?" : "&"}${key}=${value}`,
            ""
          )
          .split(" ")
          .join("%20")
      : "/";
    console.log(1);
    const finalBody: string = JSON.stringify(body);
    console.log(2, {
      method,
      ...(method !== "GET" ? { body: finalBody } : {}),
      headers: headers,
    });

    const result = await fetch(`${API_URL}${path}${queryString}`, {
      method,
      ...(method !== "GET" ? { body: finalBody } : {}),
      headers: headers,
    });
    console.log(3, result);
    const contentType = result.headers.get("Content-Type");
    if (!contentType?.includes("application/json")) {
      const text = await result.text();
      throw {
        error: result.statusText,
        message: `Expected JSON, but received ${contentType}`,
        details: text,
        status: result.status,
        headers: { "Content-Type": "application/json" },
      } as T;
    }

    // Check if response is OK

    return await result.json();
  } catch (e) {
    console.log(4, e);

    throw e;
  }
}
