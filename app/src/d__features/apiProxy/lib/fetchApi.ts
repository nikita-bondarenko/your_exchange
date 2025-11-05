"use server";

import { PROJECT_SERVER_DATA } from "@/shared/config/server";

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
    // console.log(path)
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

      const url = `${PROJECT_SERVER_DATA.apiUrl}${path}${queryString}`;

      const fetchOptions: RequestInit = {
      method,
      headers: headers || {},
    };

    if (body instanceof FormData) {
      fetchOptions.body = body;
      // УДАЛИ Content-Type — браузер сам поставит boundary
      delete (fetchOptions.headers as any)["Content-Type"];
    } else if (body !== null && body !== undefined) {
      fetchOptions.body = JSON.stringify(body);
      (fetchOptions.headers as any)["Content-Type"] = "application/json";
    }

  // console.log("fetchOptions.body:", fetchOptions.body);

    const result = await fetch(url, fetchOptions);

    // console.log("Backend response:", result);

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

    const responseBody = await result.json();

    // console.log("fetchApi result", responseBody);

    return responseBody;
  } catch (e) {
    // console.log("fetchApi error", e);
    throw e;
  }
}
