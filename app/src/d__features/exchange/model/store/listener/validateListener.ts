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

} from "../reducer/exchangeReducer";
import { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../../shared/model/store/state";
import { validateAllFields } from "@/shared/lib";
import { AppDispatch } from "../../../../../shared/model/store/appDispatch";


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
