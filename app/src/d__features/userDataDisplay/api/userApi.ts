import {
  UserListApiResponse,
  UserListApiArg,
  UserUpdateCreateApiResponse,
  UserUpdateCreateApiArg,
  CheckMailApiResponse,
  CheckMailApiArg,
  CheckConsentApiResponse,
  CheckConsentApiArg,
} from "@/shared/model/api";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/user",
  }),
  endpoints: () => ({}),
});

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    userList: build.query<UserListApiResponse, UserListApiArg>({
      query: (queryArg) => ({
        url: `/`,
        params: {
          user_id: queryArg.userId,
        },
      }),
    }),
    userUpdateCreate: build.mutation<
      UserUpdateCreateApiResponse,
      UserUpdateCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/update/`,
        method: "POST",
        body: queryArg,
      }),
    }),

    checkMail: build.mutation<CheckMailApiResponse, CheckMailApiArg>({
      query: (queryArg) => ({
        url: `/check-mail/?user_id=${queryArg.user_id}`,
      }),
    }),
    checkConsent: build.mutation<CheckConsentApiResponse, CheckConsentApiArg>({
      query: (queryArg) => ({
        url: `/check-consent/?user_id=${queryArg.user_id}`,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useUserListQuery,
  useUserUpdateCreateMutation,
  useCheckMailMutation,
  useCheckConsentMutation,
} = injectedRtkApi;

export { injectedRtkApi as userApi };
