"use server";

import { PROJECT_SERVER_DATA } from "@/shared/config/server";
import { getToken } from "@/shared/lib/serverAction";

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
    
    let responseBody: any = null;
    let isTokenValid = true;
    const tryFetch = async () => {
      const token = await getToken({ isTokenValid });

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

      // console.log(`Bearer ${token}`)
      const fetchOptions: RequestInit = {
        method,
        headers: { ...headers, Authorization: `Bearer ${token}` },
      };

      if (body instanceof FormData) {
        fetchOptions.body = body;
        delete (fetchOptions.headers as any)["Content-Type"];
      } else if (body !== null && body !== undefined) {
        fetchOptions.body = JSON.stringify(body);
        (fetchOptions.headers as any)["Content-Type"] = "application/json";
      }

      const result = await fetch(url, fetchOptions);

      const contentType = result.headers.get("Content-Type");
      if (!contentType?.includes("application/json")) {
        const text = (await result.text()).slice(0,5000);
        throw {
          error: result.statusText,
          message: `Expected JSON, but received ${contentType}`,
          details: text,
          status: result.status,
          headers: { "Content-Type": "application/json" },
        } as T;
      }
      responseBody = await result.json();
    };

    await tryFetch();

    if (responseBody?.code === "token_not_valid" || responseBody?.code === 'bad_authorization_header') {

      isTokenValid = false;
      await tryFetch();
    }

    return responseBody;
  } catch (e) {
    console.error(e)
    throw e;
  }
}
