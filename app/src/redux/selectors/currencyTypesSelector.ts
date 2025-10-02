import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { CurrencyType } from "@/redux/slices/exchangeSlice/exchangeSlice";


export type CurrencyTypes = {
  givenType: CurrencyType | null;
  receivedType: CurrencyType | null;
};

export const selectCurrencyTypes = createSelector(
  (state: RootState) => state.exchange,
  (exchange): CurrencyTypes => ({
    givenType: exchange.selectedCurrencySellType,
    receivedType: exchange.selectedCurrencyBuyType,
  })
); 