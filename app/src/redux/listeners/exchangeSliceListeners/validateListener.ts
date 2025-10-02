import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import {
  setCurrencySellAmountValue,
  setCurrencyBuyAmountValue,
  setWalletAddressValue,
  setSelectedBankValue,
  setCardNumberValue,
  setSelectedCityValue,
  setSelectedCurrencySell,
  setSelectedCurrencyBuy,
  setPhoneNumberValue,
  setPromocode,
  setIsPromocodeValid,
} from "../../slices/exchangeSlice/exchangeSlice";
import { validateAllFields } from "../../helpers/validateAllFields";
import { AppDispatch, RootState } from "../../store";
import { PayloadAction } from "@reduxjs/toolkit";
import { cryptusApi } from "@/redux/api/cryptusApi";
import { QueryStatus } from "@reduxjs/toolkit/query";

export const validateListener = createListenerMiddleware();

validateListener.startListening({
  matcher: isAnyOf(
    setCurrencySellAmountValue,
    setCurrencyBuyAmountValue,
    setWalletAddressValue,
    setSelectedBankValue,
    setCardNumberValue,
    setSelectedCityValue,
    setSelectedCurrencySell,
    setSelectedCurrencyBuy,
    setPhoneNumberValue
  ),
  effect: async (action: PayloadAction<any>, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const dispatch = listenerApi.dispatch as AppDispatch;
    validateAllFields(state, dispatch);
  },
});
