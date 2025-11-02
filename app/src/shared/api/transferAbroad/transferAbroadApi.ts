// api/transferAbroadApi.ts
import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { TransferOptionsResponse, CurrenciesResponse, TransferDetailsResponse, OrderResponse, InvoiceOrderBody, FTAOrderBody, ChinesePlatformOrderBody, AbroadCardOrderBody } from './types';

const baseQuery: BaseQueryFn = async (args) => {
  const { url, method = 'GET', body, params } = typeof args === 'string' ? { url: args } : args;

  const searchParams = params
    ? `?${new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]))}`
    : '';

  const fetchArgs: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  };

  // Для form-data (FTA)
  if (body instanceof FormData) {
    delete fetchArgs.headers;
    fetchArgs.body = body;
  }

  const res = await fetch(`/api${url}${searchParams}`, fetchArgs);
  const data = await res.json();

  return { data };
};

export const transferAbroadApi = createApi({
  reducerPath: 'transferAbroadApi',
  baseQuery,
  endpoints: (builder) => ({
    // GET /transfer-abroad/options
    getTransferOptions: builder.query<TransferOptionsResponse, void>({
      query: () => '/transfer-abroad/options',
    }),

    // GET /transfer-abroad/currencies/:transfer_option_id
    getCurrencies: builder.mutation<CurrenciesResponse, number>({
      query: (transfer_option_id) => `/transfer-abroad/currencies/${transfer_option_id}`,
    }),

    // GET /transfer-abroad/currencies/transfer-details
    getTransferDetails: builder.mutation<
      TransferDetailsResponse,
      { currency_id: number; transfer_option_id: number }
    >({
      query: ({ currency_id, transfer_option_id }) => ({
        url: '/transfer-abroad/currencies/transfer-details',
        params: { currency_id, transfer_option_id },
      }),
    }),

    // POST /transfer-abroad/order/invoice
    createInvoiceOrder: builder.mutation<OrderResponse, InvoiceOrderBody>({
      query: (body) => ({
        url: '/transfer-abroad/order/invoice',
        method: 'POST',
        body,
      }),
    }),

    // POST /transfer-abroad/order/fta
    createFTAOrder: builder.mutation<OrderResponse, FTAOrderBody>({
      query: (body) => {
        const formData = new FormData();
        formData.append('currency_name', body.currency_name);
        formData.append('amount', String(body.amount));
        formData.append('task_description', body.task_description);
        if (body.russian_company_requisites)
          formData.append('russian_company_requisites', body.russian_company_requisites);
        if (body.abroad_company_requisites)
          formData.append('abroad_company_requisites', body.abroad_company_requisites);
        if (body.file_1) formData.append('file_1', body.file_1);
        if (body.file_2) formData.append('file_2', body.file_2);

        return {
          url: '/transfer-abroad/order/fta',
          method: 'POST',
          body: formData,
        };
      },
    }),

    // POST /transfer-abroad/order/chinese-platforms
    createChinesePlatformOrder: builder.mutation<OrderResponse, ChinesePlatformOrderBody>({
      query: (body) => ({
        url: '/transfer-abroad/order/chinese-platforms',
        method: 'POST',
        body,
      }),
    }),

    // POST /transfer-abroad/order/abroad_cards
    createAbroadCardOrder: builder.mutation<OrderResponse, AbroadCardOrderBody>({
      query: (body) => ({
        url: '/transfer-abroad/order/abroad_cards',
        method: 'POST',
        body,
      }),
    }),
  }),
});

// Экспорт хуков
export const {
  useGetTransferOptionsQuery,
  useGetCurrenciesMutation,
  useGetTransferDetailsMutation,
  useCreateInvoiceOrderMutation,
  useCreateFTAOrderMutation,
  useCreateChinesePlatformOrderMutation,
  useCreateAbroadCardOrderMutation,
} = transferAbroadApi;