"use client"

import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/model/store/hooks";
import {
  selectInputValue,
  selectValueError,
  selectAreErrorsVisible,
  selectCurrencyTypes,
  selectCurrency
} from "@/shared/model/store/selectors";
import { CurrencyPosition } from "@/entities/requestDetails/ui/RequestDetails";
import { setActiveInputType, setCurrencyBuyAmountValue, setCurrencySellAmountValue, setSelectedCurrencyBuy, setSelectedCurrencySell } from "@/shared/model/store/reducers/exchangeReducer";
import { Currency } from "@/shared/api/types";

export type ExchangeInputType = "BANK" | "CASH" | "COIN";

export const useExchangeInput = (position: CurrencyPosition) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const dispatch = useAppDispatch();
  const { givenType, receivedType } = useAppSelector(selectCurrencyTypes);
  const globalStateValue = useAppSelector(selectInputValue(position));
  const valueError = useAppSelector(selectValueError(position));
  const areErrorsVisible = useAppSelector(selectAreErrorsVisible);
  const selectedCurrency = useAppSelector(selectCurrency(position));
  const currenciesSell = useAppSelector(state => state.exchange.currenciesSell);  
  const currenciesBuy = useAppSelector(state => state.exchange.currenciesBuy);
  const availableCurrenciesGet = useAppSelector(state => state.exchange.availableCurrenciesGetData)

  useEffect(() => {console.log(availableCurrenciesGet)}, [availableCurrenciesGet ])

  const onSelectChange = useCallback((option: Currency) => {
    // // console.log(option);
    dispatch(setActiveInputType(position));

    const currency = position === 'given' 
      ? currenciesSell.find((currency) => currency.id === option.id)
      : currenciesBuy.find((currency) => currency.id === option.id);

    if (currency) {
      dispatch(position === 'given' ? setSelectedCurrencySell(currency) : setSelectedCurrencyBuy(currency));
    }
  }, [dispatch, position, currenciesSell, currenciesBuy]);

  const onInputChange = useCallback((value: number | null) => {
    dispatch(setActiveInputType(position));
    switch (position) {
      case "given":
        dispatch(setCurrencySellAmountValue(value));
        break;
      case "received":
        dispatch(setCurrencyBuyAmountValue(value));
        break;

    }
  }, [dispatch, position]);

  useEffect(() => {
    setIsInitialLoad(true);
  }, [givenType, receivedType]);

  useEffect(() => {
    setIsInitialLoad(true);
  }, []);

  return {
    selectedCurrency,
    isInitialLoad,
    setIsInitialLoad,
    globalStateValue,
    valueError,
    areErrorsVisible,
    onSelectChange,
    onInputChange
  };
}; 