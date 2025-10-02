import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExchangeTypeItemProps } from "@/components/exchange/ExchangeTypeItem";
import { CurrencyPosition } from "@/components/request/RequestDetails";
import { exchangeTypesButtons } from "@/data/exchangeTypesButtons";
import { ExchangeInputType } from "@/hooks/useExchangeInput";
import {
  Bank,
  City,
  Currency,
  DirectionType,
  GetDirectionInitialDataByDirectionTypeApiResponse,
  Network,
  Rate,
} from "@/redux/api/types";
import { calculateCurrencyTypeFromDirection } from "@/helpers/calculateCurrencyTypeFromDirection";
import { string } from "zod";

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
  isPromocodeValid: boolean
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
  promocode: '',
  isPromocodeValid: false
};

export const calculateSecondaryProperties = (
  rate?: Rate,
  propertyKey?: "banks" | "networks" | "cities"
) => {
  if (!rate || !propertyKey) return [];
  const currencySellType = calculateCurrencyTypeFromDirection(
    rate.direction_type,
    "given"
  );
  switch (propertyKey) {
    case "networks": {
      if (currencySellType === "COIN") {
        return rate.currency_give.networks;
      } else {
        return rate.currency_get.networks;
      }
    }
    case "banks": {
      if (currencySellType === "BANK") {
        return rate.currency_give.banks;
      } else {
        return rate.currency_get.banks;
      }
    }
    case "cities": {
      if (currencySellType === "CASH") {
        return rate.currency_give.cities;
      } else {
        return rate.currency_get.cities;
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
      action: PayloadAction<GetDirectionInitialDataByDirectionTypeApiResponse>
    ) => {
      const initData = action.payload;
      state.exchangeRate = initData?.rate || null;

      state.currenciesSell = initData?.currencies_give || [];
      state.currenciesBuy = initData?.currencies_get || [];

      state.selectedCurrencySell = initData?.rate?.currency_give || null;
      state.selectedCurrencyBuy = initData?.rate?.currency_get || null;

      const networks = calculateSecondaryProperties(initData?.rate, "networks");
      const banks = calculateSecondaryProperties(initData?.rate, "banks");
      const cities = calculateSecondaryProperties(initData?.rate, "cities");

      state.networks = networks;
      state.banks = banks;
      state.cities = cities;

      state.selectedNetwork.value = networks[0] || null;
      state.selectedBank.value = banks[0] || null;
      state.selectedCity.value = null;
      state.promocode = ''
      state.isPromocodeValid = false
      
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
      // console.log('setCities',action.payload)
      state.cities = action.payload;
    },
    setSelectedCityValue: (state, action: PayloadAction<City | null>) => {
      // console.log('setSelectedCityValue',action.payload)
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
    setSelectedNetworkError: (state, action: PayloadAction<string | null>) => {
      state.selectedNetwork.error = action.payload;
    },
    setBanks: (state, action: PayloadAction<Bank[] | null>) => {
      state.banks = action.payload;
    },
    setSelectedBankValue: (state, action: PayloadAction<Bank | null>) => {
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
      // console.log(action.payload);
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
    setIsPromocodeValid:  (state, action: PayloadAction<boolean>) => {
      state.isPromocodeValid = action.payload;
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
  setIsPromocodeValid
} = exchangeSlice.actions;

export default exchangeSlice.reducer;
