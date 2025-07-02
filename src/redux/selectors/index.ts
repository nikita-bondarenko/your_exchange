import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

import { selectCurrencyTypes } from "./currencyTypesSelector";
import { calculateRate } from "@/helpers/calculateRate";
import { CurrencyPosition } from "@/components/request/RequestDetails";


// Section Heading Props Selector
export const selectSectionHeadingProps = (position: "given" | "received") =>
  createSelector(
    (state: RootState) => state.exchange,
    (exchange) => {
    

      return position === "given"
        ? { title: "Я отдаю", minValue: exchange.exchangeRate?.currency_give_min_value }
        : {
            title: "Я получаю",
            rate: calculateRate({
              currencyGive: exchange.selectedCurrencySell?.name || "",
              currencyGet: exchange.selectedCurrencyBuy?.name || "",
              course: exchange.exchangeRate?.course || 0,
            }),
          };
    }
  );

// Currency Types Selector
export { selectCurrencyTypes };

// Currency Options Selector
export const selectCurrencyOptions = (position: "given" | "received") =>
  createSelector(
    (state: RootState) => state.exchange,
    (exchange) => {
      switch (position) {
        case "given":
          return exchange.currenciesSell;
        case "received":
          return exchange.currenciesBuy;
        default:
          return [];
      }
    }
  );

// Bank Options Selector
export const selectBankOptions = createSelector(
  (state: RootState) => state.exchange,
  (exchange) => (exchange.banks ? exchange.banks : [])
);

// City Options Selector
export const selectCityOptions = createSelector(
  (state: RootState) => state.exchange,
  (exchange) =>  exchange.cities
);

// Nets Options Selector
export const selectNetsOptions = createSelector(
  (state: RootState) => state.exchange,
  (exchange) => (exchange.networks ? exchange.networks : [])
);

// Input Value Selector
export const selectInputValue = (position: CurrencyPosition) =>
  createSelector(
    (state: RootState) => state.exchange,
    (exchange) => {
      return position === "given"
        ? exchange.currencySellAmount.value
        : exchange.currencyBuyAmount.value;
    }
  );

// Bank Value Selector
export const selectBankValue = (state: RootState) =>state.exchange.selectedBank.value;

// City Value Selector
export const selectCityValue = (state: RootState) =>
  state.exchange.selectedCity

// Card Number Value Selector
export const selectCardNumberValue = (state: RootState) =>
  state.exchange.cardNumber.value;

// Net Value Selector
export const selectNetValue = (state: RootState) =>
  state.exchange.selectedNetwork.value;

// Wallet Address Value Selector
export const selectWalletAddressValue = (state: RootState) =>
  state.exchange.walletAddress.value;

// Selected Currency Selector

export const selectCurrency = (position: CurrencyPosition) =>
  createSelector(
    (state: RootState) => state.exchange,
    (exchange) =>
      position === "given"
        ? exchange.selectedCurrencySell
        : exchange.selectedCurrencyBuy
  );

export const selectRate = () =>
  createSelector(
    (state: RootState) => state.exchange,
    (exchange) =>
      calculateRate({
        currencyGive: exchange.selectedCurrencySell?.name || "",
        currencyGet: exchange.selectedCurrencyBuy?.name || "",
        course: exchange.exchangeRate?.course || 0,
      })
  );

// Error Selectors
export const selectValueError = (position: CurrencyPosition) =>
  createSelector(
    (state: RootState) => state.exchange,
    (exchange) => {
      return position === "given"
        ? exchange.currencySellAmount.error
        : exchange.currencyBuyAmount.error;
    }
  );

export const selectBankError = (state: RootState) =>
  state.exchange.selectedBank.error || null;
export const selectCardNumberError = (state: RootState) =>
  state.exchange.cardNumber.error;

export const selectCityError = (state: RootState) =>
  state.exchange.selectedCity ? state.exchange.selectedCity.error : null;

export const selectWalletAddressError = (state: RootState) =>
  state.exchange.walletAddress.error;

// Errors Visibility Selector
export const selectAreErrorsVisible = (state: RootState) =>
  state.exchange.areErrorsVisible;
