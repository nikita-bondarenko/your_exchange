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
} from "../../slices/exchangeSlice/exchangeSlice";
import { validateAllFields } from "../../helpers/validateAllFields";
import { AppDispatch, RootState } from "../../store";
import { PayloadAction } from "@reduxjs/toolkit";

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
    setSelectedCurrencyBuy
  ),
  effect: async (action: PayloadAction<any>, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const dispatch = listenerApi.dispatch as AppDispatch;
    validateAllFields(state, dispatch);
  },
}); 