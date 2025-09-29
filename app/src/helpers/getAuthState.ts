import { USERNAME, PASSWORD, API_URL } from "@/config";
import { AuthSlice } from "@/redux/slices/authSlice";

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
      username: USERNAME,
      password: PASSWORD,
    } as GetTokenApiArg),
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const result = await fetch(`${API_URL}/api/token/`, requestOptions);

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
