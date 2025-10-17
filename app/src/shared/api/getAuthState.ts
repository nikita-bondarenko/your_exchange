import { PROJECT_DATA } from "@/shared/config";
import { AuthSlice } from "@/shared/model/store/reducers/authReducer";

export type GetTokenApiArg = {
  username: string;
  password: string;
};

export type GetTokenApiResponse = {
  refresh: string;
  access: string;
};

export const getAuthState = async () => {
  const requestOptions = {
    method: "POST",
    body: JSON.stringify({
      username: PROJECT_DATA.credentials.username,
      password: PROJECT_DATA.credentials.password,
    } as GetTokenApiArg),
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const result = await fetch(`${PROJECT_DATA.apiUrl}/api/token/`, requestOptions);

    const token: GetTokenApiResponse = await result.json();

    return {
      token: token.access,
    } as AuthSlice;
  } catch (e) {
    console.error(e);
    return {
      token: "",
    } as AuthSlice;
  }

};
