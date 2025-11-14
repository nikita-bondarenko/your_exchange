"use server";
import {
  ensureDirectoryExist,
  fetchApi,
  FetchApiProps,
  isFileExist,
} from "@/d__features/apiProxy/lib";
import { PROJECT_SERVER_DATA } from "@/shared/config/server";
import path from "path";
import { cwd } from "process";
import { promises as fs } from "fs";

type GetTokenApiArg = {
  username: string;
  password: string;
};

type GetTokenApiResponse = {
  refresh: string;
  access: string;
};

const TOKEN_FILE_NAME = "token.txt";
const TOKEN_FILE_DIR = path.join(cwd(), "data");

export const getToken = async ({isTokenValid = true}:{isTokenValid: boolean}) => {
  await ensureDirectoryExist(TOKEN_FILE_DIR);
  const tokenFilePath = path.join(TOKEN_FILE_DIR, TOKEN_FILE_NAME);
  const isTokenFile = await isFileExist(tokenFilePath);

  const getNewToken = async () => {
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

    const tokenData = await fetchApi<GetTokenApiResponse>(tokenFetchProps);
    await fs.writeFile(path.join(tokenFilePath), tokenData?.access);
    return tokenData.access;
  };

  if (!isTokenFile || !isTokenValid) {
   return await getNewToken()
  } else {
    const tokenBuffer = await fs.readFile(tokenFilePath);
    return tokenBuffer.toString();
  }
};
