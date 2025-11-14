import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  PostCallingOperatorApiResponse,
  PostCallingOperatorApiArg,
  GetCurrenciesGetApiResponse,
  GetCurrenciesGetApiArg,
  GetDirectionInitialDataByDirectionTypeApiResponse,
  GetDirectionInitialDataByDirectionTypeApiArg,
  PostExchangesOtherApiResponse,
  PostExchangesOtherApiArg,
  ExchangesCreateApiResponse,
  ExchangesCreateApiArg,
  FaqsListApiResponse,
  FaqsListApiArg,

  GetJivoMessagesApiResponse,
  GetJivoMessagesApiArg,
  PostJivoMessagesApiResponse,
  PostJivoMessagesApiArg,
  RateListApiResponse,
  RateListApiArg,

  CheckPromocodeApiResponse,
  CheckPromocodeApiArg,

} from '@/shared/model/api';

export const api = createApi({
  reducerPath: "exchangeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  endpoints: () => ({}),
});

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    postCallingOperator: build.mutation<
      PostCallingOperatorApiResponse,
      PostCallingOperatorApiArg
    >({
      query: (queryArg) => ({
        url: `/calling-operator/`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    getCurrenciesGet: build.query<
      GetCurrenciesGetApiResponse,
      GetCurrenciesGetApiArg
    >({
      query: (queryArg) => ({
        url: `/currencies-get/`,
        params: {
          give_currency_id: queryArg.giveCurrencyId,
          currency_type: queryArg.currencyType,
        },
      }),
    }),
    getDirectionInitialDataByDirectionType: build.query<
      GetDirectionInitialDataByDirectionTypeApiResponse,
      GetDirectionInitialDataByDirectionTypeApiArg
    >({
      query: (queryArg) => ({
        url: `/direction-initial-data/${queryArg.directionType}/`,
      }),
    }),
    postExchangesOther: build.mutation<
      PostExchangesOtherApiResponse,
      PostExchangesOtherApiArg
    >({
      query: (queryArg) => ({
        url: `/exchanges-other/`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    exchangesCreate: build.mutation<
      ExchangesCreateApiResponse,
      ExchangesCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/exchange/`,
        method: "POST",
        body: queryArg,
      }),
    }),
    faqsList: build.query<FaqsListApiResponse, FaqsListApiArg>({
      query: () => ({ url: `/faqs/` }),
    }),
    getJivoMessages: build.query<
      GetJivoMessagesApiResponse,
      GetJivoMessagesApiArg
    >({
      query: () => ({ url: `/jivo-messages/` }),
    }),
    postJivoMessages: build.mutation<
      PostJivoMessagesApiResponse,
      PostJivoMessagesApiArg
    >({
      query: () => ({ url: `/jivo-messages/`, method: "POST" }),
    }),
    rateList: build.query<RateListApiResponse, RateListApiArg>({
      query: (queryArg) => ({ url: `/rate/`, params: queryArg }),
    }),
   
   
    checkPromocode: build.mutation<
      CheckPromocodeApiResponse,
      CheckPromocodeApiArg
    >({
      query: (queryArg) => ({
        url: `/check-promo-code/?code=${queryArg.code}`,
        method: "GET",
      }),
    }),
   
  }),
  overrideExisting: false,
});

export const {
  usePostCallingOperatorMutation,
  useGetCurrenciesGetQuery,
  useGetDirectionInitialDataByDirectionTypeQuery,
  usePostExchangesOtherMutation,
  useExchangesCreateMutation,
  useFaqsListQuery,
  useGetJivoMessagesQuery,
  usePostJivoMessagesMutation,
  useRateListQuery,
  useCheckPromocodeMutation,
} = injectedRtkApi;

export { injectedRtkApi as exchangeApi };
