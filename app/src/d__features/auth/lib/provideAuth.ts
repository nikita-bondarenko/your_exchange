"use server";
import path from "path";
import { promises as fs } from "fs";
import { cwd } from "process";
import { GetTokenApiArg, GetTokenApiResponse } from "@/shared/api";
import { USERNAME, PASSWORD } from "@/shared/config";
import { ensureDirectoryExist, isFileExist } from "@/shared/lib";
import { FetchApiProps, fetchApi } from "@/shared/lib/fetching";
import { NextRequest } from "next/server";


const fetchAndSaveToken = async (filePath: string) => {
  const tokenFetchProps: FetchApiProps = {
    path: "/api/token",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      username: USERNAME,
      password: PASSWORD,
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
  console.log('hi2')
  try {
    if (executionTime > maxTryTimes) {
        console.log('hi3')

      throw {
        detail: `Fetching failed after ${maxTryTimes}`,
        code: "attempts_failed",
        status: 500,
      };
    }

      console.log('hi4')

  

    const urlPath = request.nextUrl.pathname.replace(/^\/api/, '') + (!request.nextUrl.pathname.endsWith('/') ? '/' : '') || '/';

    const params = Object.fromEntries(request.nextUrl.searchParams);
    const body = request.method === "GET" ? null : await request.json();
    console.log(body);
          console.log('hi5')

    const tokenFilePath = path.join(TOKEN_FILE_DIR, TOKEN_FILE_NAME);

              console.log('hi6')

    await ensureDirectoryExist(TOKEN_FILE_DIR);
    const isTokenFile = await isFileExist(tokenFilePath);
    const fetchProps: FetchApiProps = {
      method: request.method,
      params,
      path: urlPath,
      body,
    };
          console.log('hi7')

    console.log(fetchProps);

    console.log("isTokenFile", isTokenFile);

    let result: Result;

    if (!isTokenFile) {
      await fetchAndSaveToken(tokenFilePath);
      return provideFetchWithAuth<Result>(request, executionTime + 1);
    } else {
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
        result = await fetchApi<Result>(fetchProps);
      } catch (e) {
        throw e;
      }

      //@ts-expect-error "exeptional scenary - responsive object has no fixed type"
      if (result.code === "token_not_valid") {
        await fetchAndSaveToken(tokenFilePath);
        return provideFetchWithAuth<Result>(request, executionTime + 1);
      }
    }
    return result;
  } catch (e) {
    console.log(e)
    throw e;
  }
};
