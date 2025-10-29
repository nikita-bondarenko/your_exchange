"use client";
import { exchangeApi, transferAbroadApi } from "@/shared/api";
import { useSelector } from "react-redux";

export const useGlobalLoading = () => {
  // Получаем количество активных запросов RTK Query
  const isLoading = useSelector(
    (state: any) =>
      Object.values(exchangeApi.endpoints).some(
        (endpoint: any) =>
          state[exchangeApi.reducerPath]?.queries &&
          Object.values(state[exchangeApi.reducerPath].queries).some(
            (q: any) => q?.status === "pending"
          )
      ) ||
      Object.values(transferAbroadApi.endpoints).some(
        (endpoint: any) =>
          state[transferAbroadApi.reducerPath]?.queries &&
          Object.values(state[transferAbroadApi.reducerPath].queries).some(
            (q: any) => q?.status === "pending"
          )
      )
  );

  return {
    isLoading,
  };
};
