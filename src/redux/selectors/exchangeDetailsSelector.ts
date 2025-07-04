import { RootState } from "../store";
import { RequestDetailsProps } from "@/components/request/RequestDetails";
import { calculateRate } from "@/helpers/calculateRate";
import { findIcon } from "@/helpers/findIcon";
import { valueMask } from "@/helpers/valueMask";
import { createSelector } from "@reduxjs/toolkit";
import { roundTo8 } from "../helpers";

import { selectBankValue, selectNetValue } from ".";
import {

  ExchangesCreateApiArg,
} from "../api/types";

export const selectExchangeDetails = createSelector(
  (state: RootState) => state.exchange.selectedCurrencySellType,
  (state: RootState) => state.exchange.selectedCurrencyBuyType,
  (state: RootState) => state.exchange.exchangeRate,
  (state: RootState) => state.exchange.selectedCurrencySell,
  (state: RootState) => state.exchange.selectedCurrencyBuy,
  (state: RootState) => state.exchange.currencySellAmount,
  (state: RootState) => state.exchange.currencyBuyAmount,
  (state: RootState) => state.exchange.walletAddress,
  selectBankValue,
  (state: RootState) => state.exchange.cardNumber,
  (state: RootState) => state.exchange.phoneNumber,
  (state: RootState) => state.exchange.isPhoneNumberUsed,
  (state: RootState) => state.exchange.selectedCity,
  selectNetValue,
  (
    selectedCurrencySellType,
    selectedCurrencyBuyType,
    exchangeRate,
    selectedCurrencySell,
    selectedCurrencyBuy,
    currencySellAmount,
    currencyBuyAmount,
    walletAddress,
    selectedBank,
    cardNumber,
    phoneNumber,
    isPhoneNumberUsed,
    selectedCity,
    selectedNetwork
  ): RequestDetailsProps[] => {
    // "Я отдаю"
    let give: RequestDetailsProps | null = null;
    if (selectedCurrencySellType === "COIN") {
      give = {
        title: "Я отдаю",
        rate: calculateRate({
          course: exchangeRate?.course || 0,
          currencyGive: selectedCurrencySell?.name || "",
          currencyGet: selectedCurrencyBuy?.name || "",
        }),
        currency: {
          icon:
          selectedCurrencySell?.icon || '' ,
          name: selectedCurrencySell?.name || "",
          type: "COIN",
          typeLabel: selectedNetwork?.name || "",
          value: currencySellAmount.value
            ? valueMask(roundTo8(currencySellAmount.value))
            : "",
          position: "given",
        },
      };
    } else if (selectedCurrencySellType === "BANK") {
      const wayDetails = isPhoneNumberUsed 
        ? (phoneNumber?.value ? { title: "Номер телефона", value: phoneNumber.value } : undefined)
        : (cardNumber?.value ? { title: "Карта отправления", value: cardNumber.value } : undefined);
        
      give = {
        title: "Я отдаю",
        rate: calculateRate({
          course: exchangeRate?.course || 0,
          currencyGive: selectedCurrencySell?.name || "",
          currencyGet: selectedCurrencyBuy?.name || "",
        }),
        currency: {
          icon: selectedCurrencySell?.icon || "",
          name: selectedCurrencySell?.name || "",
          type: "BANK",
          typeLabel: selectedBank?.name || "",
          value: currencySellAmount.value
            ? valueMask(roundTo8(currencySellAmount.value))
            : "",
          position: "given",
          wayDetails: wayDetails,
        },
      };
    } else if (selectedCurrencySellType === "CASH") {
      give = {
        title: "Я отдаю",
        rate: calculateRate({
          course: exchangeRate?.course || 0,
          currencyGive: selectedCurrencySell?.name || "",
          currencyGet: selectedCurrencyBuy?.name || "",
        }),
        currency: {
          icon: selectedCurrencySell?.icon || "",
          name: selectedCurrencySell?.name || "",
          type: "CASH",
          typeLabel: "Наличные",
          value: currencySellAmount.value
            ? valueMask(roundTo8(currencySellAmount.value))
            : "",
          position: "given",
          wayDetails: selectedCity?.value?.name
            ? { title: "Город отправления", value: selectedCity.value.name }
            : undefined,
        },
      };
    }

    // "Я получаю"
    let receive: RequestDetailsProps | null = null;
    if (selectedCurrencyBuyType === "COIN") {
      receive = {
        title: "Я получаю",
        currency: {
          icon: selectedCurrencyBuy?.icon || "",
          name: selectedCurrencyBuy?.name || "",
          type: "COIN",
          typeLabel: selectedNetwork?.name || "",
          value: currencyBuyAmount.value
            ? valueMask(roundTo8(currencyBuyAmount.value))
            : "",
          position: "received",
          wayDetails: walletAddress.value
            ? { title: "Адрес получения", value: walletAddress.value }
            : undefined,
        },
      };
    } else if (selectedCurrencyBuyType === "BANK") {
      const wayDetails = isPhoneNumberUsed 
        ? (phoneNumber?.value ? { title: "Номер телефона", value: phoneNumber.value } : undefined)
        : (cardNumber?.value ? { title: "Карта получения", value: cardNumber.value } : undefined);
        
      receive = {
        title: "Я получаю",
        currency: {
          icon: selectedCurrencyBuy?.icon || "",
          name: selectedCurrencyBuy?.name || "",
          type: "BANK",
          typeLabel: selectedBank?.name || "",
          value: currencyBuyAmount.value
            ? valueMask(roundTo8(currencyBuyAmount.value))
            : "",
          position: "received",
          wayDetails: wayDetails,
        },
      };
    } else if (selectedCurrencyBuyType === "CASH") {
      receive = {
        title: "Я получаю",
        currency: {
          icon: selectedCurrencyBuy?.icon || "",
          name: selectedCurrencyBuy?.name || "",
          type: "CASH",
          typeLabel: "Наличные",
          value: currencyBuyAmount.value
            ? valueMask(roundTo8(currencyBuyAmount.value))
            : "",
          position: "received",
          wayDetails: selectedCity?.value?.name
            ? { title: "Город получения", value: selectedCity.value.name }
            : undefined,
        },
      };
    }

    return [give, receive].filter(Boolean) as RequestDetailsProps[];
  }
);

export const selectExchangeCreateData = createSelector(
  (state: RootState) => state.exchange.currencySellAmount,
  (state: RootState) => state.exchange.currencyBuyAmount,
  (state: RootState) => state.exchange.walletAddress,
  (state: RootState) => state.exchange.cardNumber,
  (state: RootState) => state.exchange.phoneNumber,
  (state: RootState) => state.exchange.isPhoneNumberUsed,
  (state: RootState) => state.user.id,
  (state: RootState) => state.exchange.exchangeRate?.id,
  (state: RootState) => state.exchange.exchangeRate?.course,
  (
    currencySellAmount,
    currencyBuyAmount,
    walletAddress,
    cardNumber,
    phoneNumber,
    isPhoneNumberUsed,
    userId,
    exchangeRateId,
    course
  ): ExchangesCreateApiArg => {
    const cardValue = isPhoneNumberUsed 
      ? (phoneNumber?.value || "") 
      : (cardNumber?.value || "");
      
    return {
      user_id: userId || -1,
      direction_id: exchangeRateId || -1,
      currency_give_amount: currencySellAmount.value || -1,
      currency_get_amount: currencyBuyAmount.value || -1,
      card: cardValue,
      wallet: walletAddress.value || "",
      course: course || 0
    };
  }
);

