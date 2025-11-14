import { useAppSelector } from "@/shared/model/store";
import { useState, useEffect } from "react";
import { TransferAbroadCurrency, useGetCurrenciesMutation } from "../api";

export const useTransferCurrenciesOptions = () => {
  const selectedTranserTypeOptionId = useAppSelector(
    (state) => state.transferAbroad.selectedTranserTypeOptionId
  );

  const [currencies, setCurrencies] = useState<TransferAbroadCurrency[]>([]);

  const [getCurrencies] = useGetCurrenciesMutation();

  useEffect(() => {
    
    if (selectedTranserTypeOptionId) {
      getCurrencies(selectedTranserTypeOptionId).then(({ data }) => {
        console.log(data)
        if (data?.currencies) setCurrencies(data?.currencies);
      });
    }
  }, [selectedTranserTypeOptionId]);

  return {
    currencies,
  };
};
