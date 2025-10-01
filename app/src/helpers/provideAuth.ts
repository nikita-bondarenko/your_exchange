"use server";
import path from "path";
import { promises as fs } from "fs";
import { cwd } from "process";
import { USERNAME, PASSWORD } from "@/config";
import { FetchApiProps, fetchApi } from "@/redux/helpers/fetchApi";
import { GetTokenApiArg, GetTokenApiResponse } from "./getAuthState";
import { NextRequest } from "next/server";
import { isFileExist } from "./checkTokenFile";

const fetchWithoutToken = async <Result>(fetchProps: FetchApiProps) => {
  const tokenFetchProps: FetchApiProps = {
    path: "/api/token/",
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

  await fs.writeFile(path.join(cwd(), "token.txt"), token?.access || "");

  fetchProps.headers = {
    Authorization: `Bearer ${token.access}`,
    "Content-Type": "application/json",
  };

  return fetchApi<Result>(fetchProps);
};

export const provideFetchWithAuth = async <Result>(request: NextRequest) => {
  const urlPath = request.nextUrl.pathname.slice(4) + "/";
  const params = Object.fromEntries(request.nextUrl.searchParams);

  const body = request.method === "GET" ? null : await request.json();
  const tokenFilePath = path.join(cwd(), "data", "token.txt");

  const isTokenFile = await isFileExist(tokenFilePath);

  const fetchProps: FetchApiProps = {
    method: request.method,
    params,
    path: urlPath,
    body,
  };

  let result: Result;

  if (!isTokenFile) {
    result = await fetchWithoutToken(fetchProps);
  } else {
    const token = await fs.readFile(tokenFilePath);
    fetchProps.headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    result = await fetchApi<Result>(fetchProps);
    //@ts-expect-error "exeptional scenary"
    if (result.code === "token_not_valid") {
      result = await fetchWithoutToken(fetchProps);
    }
  }

  return result;
};
