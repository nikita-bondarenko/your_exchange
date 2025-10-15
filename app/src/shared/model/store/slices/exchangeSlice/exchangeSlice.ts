import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExchangeTypeItemProps } from "@/b__pages/exchangeType/ui/exchangeTypeSelect/ExchangeTypeItem";
import { CurrencyPosition } from "@/entities/requestDetails/ui/RequestDetails";

import {
  Bank,
  City,
  Currency,
  DirectionType,
  GetCurrenciesGetApiResponse,
  GetDirectionInitialDataByDirectionTypeApiResponse,
  Network,
  Rate,
} from "@/shared/api/types";
import {
  calculateCurrencyTypeFromDirection,
  Direction,
} from "@/shared/lib/currency/calculateCurrencyTypeFromDirection";
import { number, string } from "zod";
import { getAvailableCurrenciesBuyDetails } from "@/shared/lib/currency/getAvailableCurrenciesBuyDetails";

export type ExchangeInput<T> = {
  value: T | null;
  error: string | null;
};

export type CurrencyType = "COIN" | "CASH" | "BANK";

export type ExchangeState = {
  currenciesSell: Currency[];
  currenciesBuy: Currency[];
  selectedCurrencySell: Currency | null;
  selectedCurrencyBuy: Currency | null;
  selectedCurrencySellType: CurrencyType | null;
  selectedCurrencyBuyType: CurrencyType | null;
  currencyBuyTypeOptions: ExchangeTypeItemProps[] | null;
  cities: City[] | null;
  selectedCity: ExchangeInput<City | null>;
  networks: Network[] | null;
  selectedNetwork: ExchangeInput<Network | null>;
  banks: Bank[] | null;
  selectedBank: ExchangeInput<Bank | null>;
  cardNumber: ExchangeInput<string | null>;
  phoneNumber: ExchangeInput<string | null>;
  isPhoneNumberUsed: boolean;
  walletAddress: ExchangeInput<string | null>;
  areErrorsVisible: boolean;
  areErrors: boolean;
  activeInputType: CurrencyPosition | null;
  exchangeRate: Rate | null;
  currencySellAmount: ExchangeInput<number | null>;
  currencyBuyAmount: ExchangeInput<number | null>;
  isRateBeingPulled: boolean;
  promocode: string;
  isPromocodeValid: boolean;
  availableCurrenciesGetData: GetCurrenciesGetApiResponse | null;
  initialData: GetDirectionInitialDataByDirectionTypeApiResponse | null;
};

export const initialState: ExchangeState = {
  currenciesSell: [],
  currenciesBuy: [],
  selectedCurrencySell: null,
  selectedCurrencyBuy: null,
  selectedCurrencySellType: null,
  selectedCurrencyBuyType: null,
  currencyBuyTypeOptions: null,
  cities: null,
  selectedCity: {
    value: null,
    error: null,
  },
  networks: null,
  selectedNetwork: {
    value: null,
    error: null,
  },
  banks: null,
  selectedBank: {
    value: null,
    error: null,
  },
  cardNumber: {
    value: null,
    error: null,
  },
  phoneNumber: {
    value: null,
    error: null,
  },
  isPhoneNumberUsed: false,
  walletAddress: {
    value: null,
    error: null,
  },
  areErrorsVisible: false,
  areErrors: false,
  activeInputType: null,
  exchangeRate: null,
  currencySellAmount: {
    value: null,
    error: null,
  },
  currencyBuyAmount: {
    value: null,
    error: null,
  },
  isRateBeingPulled: false,
  promocode: "",
  isPromocodeValid: false,
  availableCurrenciesGetData: null,
  initialData: null,
};

export const calculateSecondaryProperties = ({
  rate,
  propertyKey,
  initialData,
  selectedCurrencyBuyId,
  selectedCurrencySellId,
}: {
  rate?: Rate;
  propertyKey?: "banks" | "networks" | "cities";
  initialData?: GetDirectionInitialDataByDirectionTypeApiResponse;
  selectedCurrencySellId?: number;
  selectedCurrencyBuyId?: number;
}) => {
  if (!rate || !propertyKey) return [];
  const currencySellType = calculateCurrencyTypeFromDirection(
    rate.direction_type,
    "given"
  );

  let currencyGive: Currency | undefined = rate.currency_give;
  let currencyGet: Currency | undefined = rate.currency_get;

  if (selectedCurrencySellId) {
    currencyGive = initialData?.currencies_give?.find(
      (currency) => currency.id === selectedCurrencySellId
    );
  }

  if (selectedCurrencyBuyId) {
    currencyGet = initialData?.currencies_get?.find(
      (currency) => currency.id === selectedCurrencyBuyId
    );
  }

  switch (propertyKey) {
    case "networks": {
      if (currencySellType === "COIN") {
        return currencyGive?.networks || [];
      } else {
        return currencyGet?.networks || [];
      }
    }
    case "banks": {
      if (currencySellType === "BANK") {
        return currencyGive?.banks || [];
      } else {
        return currencyGet?.banks || [];
      }
    }
    case "cities": {
      if (currencySellType === "CASH") {
        return currencyGive?.cities || [];
      } else {
        return currencyGet?.cities || [];
      }
    }
  }
};

export const exchangeSlice = createSlice({
  name: "exchange",
  initialState,
  reducers: {
    setInitialData: (
      state,
      action: PayloadAction<{
        initData: GetDirectionInitialDataByDirectionTypeApiResponse;
        availableCurrenciesGet: GetCurrenciesGetApiResponse;
      }>
    ) => {
      const initData = action.payload.initData;
      const availableCurrenciesGet = action.payload.availableCurrenciesGet;

      state.initialData = initData;
      state.availableCurrenciesGetData = availableCurrenciesGet;
      state.exchangeRate = initData?.rate || null;

      state.currenciesSell = initData?.currencies_give || [];

      console.log('initData',availableCurrenciesGet)

      const {
        
        selectedNetwork,
        selectedBank,
        networks,
        banks,
        selectedCurrencyBuy,
        currenciesBuy,
      } = getAvailableCurrenciesBuyDetails({
        initialData: initData,
        availableCurrenciesGet,
      });
      

      state.currenciesBuy = currenciesBuy;

      state.selectedCurrencySell = initData?.rate?.currency_give || null;
      if (selectedCurrencyBuy)
      state.selectedCurrencyBuy = selectedCurrencyBuy;

      const cities = calculateSecondaryProperties({
        rate: initData.rate,
        initialData: initData,
        propertyKey: "cities",
      });

      state.networks = networks;
      state.banks = banks;
      state.cities = cities;

      state.selectedNetwork.value = selectedNetwork;
      state.selectedBank.value = selectedBank;
      state.selectedCity.value = null;
      state.promocode = "";
      state.isPromocodeValid = false;

      // Reset phone number fields
      if (!state.phoneNumber) {
        state.phoneNumber = { value: null, error: null };
      } else {
        state.phoneNumber.value = null;
        state.phoneNumber.error = null;
      }
      if (state.isPhoneNumberUsed === undefined) {
        state.isPhoneNumberUsed = false;
      } else {
        state.isPhoneNumberUsed = false;
      }
    },
    setPromocode: (state, action: PayloadAction<string>) => {
      state.promocode = action.payload;
    },
    setCurrenciesSell: (state, action: PayloadAction<Currency[]>) => {
      state.currenciesSell = action.payload;
    },
    setCurrenciesBuy: (state, action: PayloadAction<Currency[]>) => {
      state.currenciesBuy = action.payload;
    },
    setSelectedCurrencySell: (
      state,
      action: PayloadAction<Currency | null>
    ) => {
      state.selectedCurrencySell = action.payload;
    },
    setSelectedCurrencyBuy: (state, action: PayloadAction<Currency | null>) => {
      state.selectedCurrencyBuy = action.payload;
    },
    setSelectedCurrencyBuyWithoutListening: (
      state,
      action: PayloadAction<Currency | null>
    ) => {
      state.selectedCurrencyBuy = action.payload;
    },
    setSelectedCurrencySellType: (
      state,
      action: PayloadAction<CurrencyType | null>
    ) => {
      if (state.selectedCurrencySellType === action.payload) return;
      state.selectedCurrencySellType = action.payload;
    },
    setSelectedCurrencyBuyType: (
      state,
      action: PayloadAction<CurrencyType | null>
    ) => {
      if (state.selectedCurrencyBuyType === action.payload) return;
      state.selectedCurrencyBuyType = action.payload;
    },
    setCurrencyBuyTypeOptions: (
      state,
      action: PayloadAction<ExchangeTypeItemProps[] | null>
    ) => {
      state.currencyBuyTypeOptions = action.payload;
    },
    setCities: (state, action: PayloadAction<City[] | null>) => {
      state.cities = action.payload;
    },
    setSelectedCityValue: (state, action: PayloadAction<City | null>) => {
      state.selectedCity.value = action.payload;
    },
    setSelectedCityError: (state, action: PayloadAction<string | null>) => {
      state.selectedCity.error = action.payload;
    },
    setNetworks: (state, action: PayloadAction<Network[] | null>) => {
      state.networks = action.payload;
    },
    setSelectedNetworkValue: (state, action: PayloadAction<Network | null>) => {
      state.selectedNetwork.value = action.payload;
    },
    setSelectedNetworkValueWithoutListening: (
      state,
      action: PayloadAction<Network | null>
    ) => {
      state.selectedNetwork.value = action.payload;
    },
    setSelectedNetworkError: (state, action: PayloadAction<string | null>) => {
      state.selectedNetwork.error = action.payload;
    },
    setBanks: (state, action: PayloadAction<Bank[] | null>) => {
      state.banks = action.payload;
    },
    setSelectedBankValue: (state, action: PayloadAction<Bank | null>) => {
      state.selectedBank.value = action.payload;
    },
    setSelectedBankValueWithoutListening: (
      state,
      action: PayloadAction<Bank | null>
    ) => {
      state.selectedBank.value = action.payload;
    },
    setSelectedBankError: (state, action: PayloadAction<string | null>) => {
      state.selectedBank.error = action.payload;
    },
    setCardNumberValue: (state, action: PayloadAction<string | null>) => {
      state.cardNumber.value = action.payload;
    },
    setCardNumberError: (state, action: PayloadAction<string | null>) => {
      state.cardNumber.error = action.payload;
    },
    setPhoneNumberValue: (state, action: PayloadAction<string | null>) => {
      if (!state.phoneNumber) {
        state.phoneNumber = { value: null, error: null };
      }
      state.phoneNumber.value = action.payload;
    },
    setPhoneNumberError: (state, action: PayloadAction<string | null>) => {
      if (!state.phoneNumber) {
        state.phoneNumber = { value: null, error: null };
      }
      state.phoneNumber.error = action.payload;
    },
    setIsPhoneNumberUsed: (state, action: PayloadAction<boolean>) => {
      if (state.isPhoneNumberUsed === undefined) {
        state.isPhoneNumberUsed = false;
      }
      state.isPhoneNumberUsed = action.payload;
    },
    setWalletAddressValue: (state, action: PayloadAction<string | null>) => {
      state.walletAddress.value = action.payload;
    },
    setWalletAddressError: (state, action: PayloadAction<string | null>) => {
      state.walletAddress.error = action.payload;
    },
    setAreErrorsVisible: (state, action: PayloadAction<boolean>) => {
      state.areErrorsVisible = action.payload;
    },
    setAreErrors: (state, action: PayloadAction<boolean>) => {
      state.areErrors = action.payload;
    },
    setActiveInputType: (
      state,
      action: PayloadAction<CurrencyPosition | null>
    ) => {
      state.activeInputType = action.payload;
    },
    setExchangeRate: (state, action: PayloadAction<Rate | null>) => {
      state.exchangeRate = action.payload;
    },
    setCurrencySellAmountValue: (
      state,
      action: PayloadAction<number | null>
    ) => {
      state.currencySellAmount.value = action.payload;
    },
    setCurrencySellAmountError: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.currencySellAmount.error = action.payload;
    },
    setCurrencyBuyAmountValue: (
      state,
      action: PayloadAction<number | null>
    ) => {
      state.currencyBuyAmount.value = action.payload;
    },
    setCurrencyBuyAmountError: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.currencyBuyAmount.error = action.payload;
    },
    clearCurrencies: (state) => {
      state.currenciesSell = [];
      state.currenciesBuy = [];
      state.selectedCurrencySell = null;
      state.selectedCurrencyBuy = null;
      state.selectedCurrencySellType = null;
      state.selectedCurrencyBuyType = null;
      state.currencyBuyTypeOptions = null;
    },
    clearAll: (state) => {
      return initialState;
    },
    setIsRateBeingPulled: (state, action: PayloadAction<boolean>) => {
      state.isRateBeingPulled = action.payload;
    },
    setIsPromocodeValid: (state, action: PayloadAction<boolean>) => {
      state.isPromocodeValid = action.payload;
    },

    setAvailableCurrenciesGetData: (
      state,
      action: PayloadAction<Currency[]>
    ) => {
      state.availableCurrenciesGetData = action.payload;
    },
  },
});

export const {
  setCurrenciesSell,
  setCurrenciesBuy,
  setSelectedCurrencySell,
  setSelectedCurrencyBuy,
  setSelectedCurrencySellType,
  setSelectedCurrencyBuyType,
  setCurrencyBuyTypeOptions,
  setCities,
  setSelectedCityValue,
  setSelectedCityError,
  setNetworks,
  setSelectedNetworkValue,
  setSelectedNetworkError,
  setBanks,
  setSelectedBankValue,
  setSelectedBankError,
  setCardNumberValue,
  setCardNumberError,
  setPhoneNumberValue,
  setPhoneNumberError,
  setIsPhoneNumberUsed,
  setWalletAddressValue,
  setWalletAddressError,
  setAreErrorsVisible,
  setAreErrors,
  setActiveInputType,
  setExchangeRate,
  setCurrencySellAmountValue,
  setCurrencySellAmountError,
  setCurrencyBuyAmountValue,
  setCurrencyBuyAmountError,
  clearCurrencies,
  clearAll,
  setInitialData,
  setIsRateBeingPulled,
  setPromocode,
  setIsPromocodeValid,
  setAvailableCurrenciesGetData,
  setSelectedBankValueWithoutListening,
  setSelectedCurrencyBuyWithoutListening,
  setSelectedNetworkValueWithoutListening,
} = exchangeSlice.actions;

export default exchangeSlice.reducer;
