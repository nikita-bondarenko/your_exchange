"use server";
import path from "path";
import { promises as fs } from "fs";
import { cwd } from "process";
import { PROJECT_SERVER_DATA } from "@/shared/config/server";

import { NextRequest } from "next/server";
import { isFileExist } from "./checkTokenFile";
import { ensureDirectoryExist } from "./ensureDIrectoryExist";
import { FetchApiProps, fetchApi } from "./fetchApi";

type GetTokenApiArg = {
  username: string;
  password: string;
};

type GetTokenApiResponse = {
  refresh: string;
  access: string;
};

const fetchAndSaveToken = async (filePath: string) => {
  const tokenFetchProps: FetchApiProps = {
    path: "/api/token",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      username: PROJECT_SERVER_DATA.username,
      password: PROJECT_SERVER_DATA.password,
    } as GetTokenApiArg,
    method: "POST",
  };

  const token = await fetchApi<GetTokenApiResponse>(tokenFetchProps);
  await fs.writeFile(path.join(filePath), token?.access || "");
};

const maxTryTimes = 5;

const TOKEN_FILE_NAME = "token.txt";
const TOKEN_FILE_DIR = path.join(cwd(), "data");

export const provideFetchWithAuth = async <Result>(
  request: NextRequest,
  executionTime: number = 1
): Promise<any> => {
  try {
    // if (request.method === "POST") console.log(1);
    if (executionTime > maxTryTimes) {
      // if (request.method === "POST") console.log(2);

      throw {
        detail: `Fetching failed after ${maxTryTimes}`,
        code: "attempts_failed",
        status: 500,
      };
    }

    const urlPath =
      request.nextUrl.pathname.replace(/^\/api/, "") +
        (!request.nextUrl.pathname.endsWith("/") ? "/" : "") || "/";
    // if (request.method === "POST") console.log(3);

    const params = Object.fromEntries(request.nextUrl.searchParams);

    let body: any = null;
    if (request.method !== "GET" && request.method !== "HEAD") {
      const contentType = request.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        body = await request.json();
      } else if (contentType.includes("multipart/form-data")) {
        body = await request.formData();
      } else {
        body = await request.text();
      }
    }
    // if (request.method === "POST") console.log(4);

    const tokenFilePath = path.join(TOKEN_FILE_DIR, TOKEN_FILE_NAME);

    await ensureDirectoryExist(TOKEN_FILE_DIR);
    const isTokenFile = await isFileExist(tokenFilePath);
    const fetchProps: FetchApiProps = {
      method: request.method,
      params,
      path: urlPath,
      body,
    };
    // if (request.method === "POST") console.log(5);

    let result: Result;

    if (!isTokenFile) {
      // if (request.method === "POST") console.log(6);

      await fetchAndSaveToken(tokenFilePath);
      return provideFetchWithAuth<Result>(request, executionTime + 1);
    } else {
      // if (request.method === "POST") console.log(7);

      const token = await fs.readFile(tokenFilePath);
      if (token.length === 0) {
        await fetchAndSaveToken(tokenFilePath);
        return provideFetchWithAuth<Result>(request, executionTime + 1);
      }
      fetchProps.headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      try {
        // if (request.method === "POST") console.log(8);

        result = await fetchApi<Result>(fetchProps);
      } catch (e) {
        throw e;
      }

      //@ts-expect-error "exeptional scenary - responsive object has no fixed type"
      if (result.code === "token_not_valid") {
        console.log(8);

        await fetchAndSaveToken(tokenFilePath);
        return provideFetchWithAuth<Result>(request, executionTime + 1);
      }
    }
    // if (request.method === "POST") console.log(9);

    return result;
  } catch (e) {
    // if (request.method === "POST") console.log(10);

    // console.log("provideFetchWithAuth error", e);
    throw e;
  }
};
