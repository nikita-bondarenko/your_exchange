"use client";
import { exchangeApi } from "@/d__features/exchange/api";
import { transferAbroadApi } from "@/d__features/transferAbroad/api";
import { RootState } from "@/shared/model/store";
import { useSelector } from "react-redux";


const hasPendingQueries = (state: RootState, api: any) =>
// @ts-expect-error expectedly for this type of abstraction
  Object.values(state[api.reducerPath]?.queries || {}).some(
    (query: any) => query?.status === "pending"
  );

const hasPendingMutations = (state: RootState, api: any) =>
  // @ts-expect-error expectedly for this type of abstraction
  Object.values(state[api.reducerPath]?.mutations || {}).some(
    (mutation: any) => mutation?.status === "pending"
  );

// Основной селектор
export const selectIsLoading = (state: RootState) =>
  hasPendingQueries(state, exchangeApi) ||
  hasPendingMutations(state, exchangeApi) ||
  hasPendingQueries(state, transferAbroadApi) ||
  hasPendingMutations(state, transferAbroadApi);


export const useGlobalLoading = () => {
  // Получаем количество активных запросов RTK Query
  const isLoading = useSelector(selectIsLoading);

  return {
    isLoading,
  };
};
