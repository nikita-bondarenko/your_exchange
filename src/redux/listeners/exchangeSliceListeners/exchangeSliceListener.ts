import { calculateSecondaryProperties, CurrencyType, setInitialData } from "@/redux/slices/exchangeSlice/exchangeSlice";
import { createListenerMiddleware, PayloadAction } from "@reduxjs/toolkit";
import {
  setBanks,
  setCities,
  setCurrenciesBuy,
  setCurrenciesSell,
  setCurrencyBuyAmountValue,
  setCurrencyBuyTypeOptions,
  setCurrencySellAmountValue,
  setExchangeRate,
  setNetworks,
  setSelectedBankValue,
  setSelectedCityValue,
  setSelectedCurrencyBuy,
  setSelectedCurrencyBuyType,
  setSelectedCurrencySell,
  setSelectedCurrencySellType,
  setSelectedNetworkValue,
} from "../../slices/exchangeSlice/exchangeSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { exchangeTypesButtons } from "@/data/exchangeTypesButtons";
import { cryptusApi } from "@/redux/api/cryptusApi";
import { DirectionType } from "@/redux/api/types";
import { calculateInputAmountBasedOnAnotherOne } from "@/redux/helpers/calculateInputAmountBasedOnAnotherOne";

export const filterReceiveVariants = (selectedGiveType: CurrencyType) => {
  switch (selectedGiveType) {
    case "COIN": {
      return exchangeTypesButtons.filter(
        (item) => item.type !== selectedGiveType
      );
    }
    default: {
      return exchangeTypesButtons.filter((item) => item.type === "COIN");
    }
  }
};

export const exchangeSliceListener = createListenerMiddleware();

exchangeSliceListener.startListening({
  actionCreator: setSelectedCurrencySellType,
  effect: async (action, listenerApi) => {
    const dispatch = listenerApi.dispatch as AppDispatch;
    const receiveVariants = filterReceiveVariants(
      action.payload as CurrencyType
    );
    dispatch(setCurrencyBuyTypeOptions(receiveVariants));
    dispatch(setSelectedCurrencyBuyType(receiveVariants[0].type));
  },
});

exchangeSliceListener.startListening({
  actionCreator: setSelectedCurrencyBuyType,
  effect: async (action, listenerApi) => {
    const dispatch = listenerApi.dispatch as AppDispatch;
    const state = listenerApi.getState() as RootState;
    const { selectedCurrencySellType } = state.exchange;

    const directionType = `${selectedCurrencySellType} - ${action.payload}`;
    const { data } = await listenerApi.dispatch(
      cryptusApi.endpoints.getDirectionInitialDataByDirectionType.initiate({
        directionType,
      })
    );
    if (!data) return;
    dispatch(setInitialData(data));
  },
});

exchangeSliceListener.startListening({
  actionCreator: setSelectedCurrencySell,
  effect: async (action, listenerApi) => {
    const dispatch = listenerApi.dispatch as AppDispatch;
    const state = listenerApi.getState() as RootState;
    const selectedCurrencySell = action.payload;
    const { selectedCurrencySellType, selectedCurrencyBuyType } = state.exchange;
    // console.log(1)
    switch (selectedCurrencySellType) { 
      case "COIN": {  
        dispatch(setSelectedNetworkValue(selectedCurrencySell?.networks?.[0] || null));
        dispatch(setNetworks( selectedCurrencySell?.networks || null));
        break;
      }
      case "CASH" : {
        // console.log(2)
        dispatch(setSelectedCityValue(null))
      }
      case "BANK": {
        dispatch(setSelectedBankValue(null));
        dispatch(setBanks( selectedCurrencySell?.banks || null));
      }
    }
    if (
      selectedCurrencySell?.id === selectedCurrencySell?.id ||
      !selectedCurrencySell?.id ||
      !selectedCurrencyBuyType
    )
      return;
    const { data } = await listenerApi.dispatch(
      cryptusApi.endpoints.getCurrenciesGet.initiate({
        giveCurrencyId: selectedCurrencySell?.id,
        currencyType: selectedCurrencyBuyType,
      })
    );
    if (!data) return;
  
    dispatch(setCurrenciesBuy(data));
    dispatch(setSelectedCurrencyBuy(data?.[0] || null));
  },
});

exchangeSliceListener.startListening({
  actionCreator: setSelectedCurrencyBuy,
  effect: async (action, listenerApi) => {
    const dispatch = listenerApi.dispatch as AppDispatch;
    const state = listenerApi.getState() as RootState;
    const selectedCurrencyBuy = action.payload;
    const selectedCurrencyBuyNetwork = selectedCurrencyBuy?.networks[0]
    const selectedCurrencyBuyCity = selectedCurrencyBuy?.cities[0]
    const selectedCurrencyBuyBank = selectedCurrencyBuy?.banks[0]


    const {
      selectedCurrencySell,
      selectedCurrencySellType,
      selectedCurrencyBuyType,
      selectedBank,
      selectedCity,
      selectedNetwork
    } = state.exchange;

   switch (selectedCurrencyBuyType) { 
    case "COIN": {  
      dispatch(setSelectedNetworkValue(selectedCurrencyBuy?.networks?.[0] || null));
      dispatch(setNetworks( selectedCurrencyBuy?.networks || null));
      break;
    }
    case "CASH" : {
      dispatch(setSelectedCityValue(null))
    }
    case "BANK": {
      dispatch(setSelectedBankValue(null));
      dispatch(setBanks( selectedCurrencyBuy?.banks || null));
    }
  }
    if (
      !selectedCurrencySell?.id ||
      !selectedCurrencyBuy?.id ||
      !selectedCurrencySellType ||
      !selectedCurrencyBuyType
    )
      return;
    const { data } = await listenerApi.dispatch(
      cryptusApi.endpoints.rateList.initiate({
        direction_type:
          `${selectedCurrencySellType} - ${selectedCurrencyBuyType}` as DirectionType,
        currency_give_id: selectedCurrencySell?.id,
        currency_get_id: selectedCurrencyBuy?.id,
        network_id: selectedCurrencyBuyNetwork?.id || selectedNetwork?.value?.id,
        bank_id: selectedCurrencyBuyBank?.id || selectedBank?.value?.id,
        city_id: selectedCurrencyBuyCity?.id || selectedCity?.value?.id,
      })
    );
    if (!data) return;
    dispatch(setExchangeRate(data?.rate || null));
    const cities = calculateSecondaryProperties(data?.rate, 'cities')
    dispatch(setCities(cities))
  },
});

exchangeSliceListener.startListening({
  actionCreator: setSelectedNetworkValue,
  effect: async (action, listenerApi) => {
    const dispatch = listenerApi.dispatch as AppDispatch;
    const state = listenerApi.getState() as RootState;
    const selectedNetworkValue = action.payload;
    const {
      selectedCurrencySell,
      selectedCurrencySellType,
      selectedCurrencyBuyType,
      selectedBank,
      selectedCity,
      selectedCurrencyBuy,
    } = state.exchange;

    if (
      !selectedCurrencySell?.id ||
      !selectedCurrencyBuy?.id ||
      !selectedCurrencySellType ||
      !selectedCurrencyBuyType
    )
      return;

    const { data } = await listenerApi.dispatch(
      cryptusApi.endpoints.rateList.initiate({
        direction_type:
          `${selectedCurrencySellType} - ${selectedCurrencyBuyType}` as DirectionType,
        currency_give_id: selectedCurrencySell?.id,
        currency_get_id: selectedCurrencyBuy?.id,
        network_id: selectedNetworkValue?.id,
        bank_id: selectedBank?.value?.id,
        city_id: selectedCity?.value?.id,
      })
    );
    if (!data) return;
    dispatch(setExchangeRate(data?.rate || null));
    const cities = calculateSecondaryProperties(data?.rate, 'cities')
    dispatch(setCities(cities))
  },
});

exchangeSliceListener.startListening({
  actionCreator: setSelectedBankValue,
  effect: async (action, listenerApi) => {
    const dispatch = listenerApi.dispatch as AppDispatch;
    const state = listenerApi.getState() as RootState;
    const selectedBankValue = action.payload;
    const {
      selectedCurrencySell,
      selectedCurrencySellType,
      selectedCurrencyBuyType,
      selectedNetwork,
      selectedCity,
      selectedCurrencyBuy,
    } = state.exchange;

    if (
      !selectedCurrencySell?.id ||
      !selectedCurrencyBuy?.id ||
      !selectedCurrencySellType ||
      !selectedCurrencyBuyType
    )
      return;

    const { data } = await listenerApi.dispatch(
      cryptusApi.endpoints.rateList.initiate({
        direction_type:
          `${selectedCurrencySellType} - ${selectedCurrencyBuyType}` as DirectionType,
        currency_give_id: selectedCurrencySell?.id,
        currency_get_id: selectedCurrencyBuy?.id,
        network_id: selectedNetwork?.value?.id,
        bank_id: selectedBankValue?.id,
        city_id: selectedCity?.value?.id,
      })
    );
    if (!data) return;
    dispatch(setExchangeRate(data?.rate || null));
    const cities = calculateSecondaryProperties(data?.rate, 'cities')
    dispatch(setCities(cities))
  },
});


exchangeSliceListener.startListening({
  actionCreator: setSelectedCityValue,
  effect: async (action, listenerApi) => {
    const dispatch = listenerApi.dispatch as AppDispatch;
    const state = listenerApi.getState() as RootState;
    const selectedCityValue = action.payload;
    const {
      selectedCurrencySell,
      selectedCurrencySellType,
      selectedCurrencyBuyType,
      selectedNetwork,
      selectedBank,
      selectedCurrencyBuy,
    } = state.exchange;

    if (
      !selectedCurrencySell?.id ||
      !selectedCurrencyBuy?.id ||
      !selectedCurrencySellType ||
      !selectedCurrencyBuyType || !selectedCityValue
    )
      return;

    const { data } = await listenerApi.dispatch(
      cryptusApi.endpoints.rateList.initiate({
        direction_type:
          `${selectedCurrencySellType} - ${selectedCurrencyBuyType}` as DirectionType,
        currency_give_id: selectedCurrencySell?.id,
        currency_get_id: selectedCurrencyBuy?.id,
        network_id: selectedNetwork?.value?.id,
        bank_id: selectedBank?.value?.id,
        city_id: selectedCityValue?.id,
      })
    );
    if (!data) return;
    dispatch(setExchangeRate(data?.rate || null));
    const cities = calculateSecondaryProperties(data?.rate, 'cities')
    dispatch(setCities(cities))
  },
});

exchangeSliceListener.startListening({
  actionCreator: setCurrencySellAmountValue,
  effect: async (action, listenerApi) => {
    const dispatch = listenerApi.dispatch as AppDispatch;
    const state = listenerApi.getState() as RootState;
    const { selectedCurrencySellType, selectedCurrencyBuyType, selectedCurrencySell, selectedCurrencyBuy, exchangeRate, activeInputType } = state.exchange;

    if (!selectedCurrencySellType || !selectedCurrencyBuyType || !selectedCurrencySell || !selectedCurrencyBuy || !exchangeRate || activeInputType !== "given") return;

    const currencyBuyAmount = calculateInputAmountBasedOnAnotherOne(action.payload, exchangeRate, "given");
    dispatch(setCurrencyBuyAmountValue(currencyBuyAmount));
  },
});

exchangeSliceListener.startListening({
  actionCreator: setCurrencyBuyAmountValue,
  effect: async (action, listenerApi) => {
    const dispatch = listenerApi.dispatch as AppDispatch;
    const state = listenerApi.getState() as RootState;
    const { selectedCurrencySellType, selectedCurrencyBuyType, selectedCurrencySell, selectedCurrencyBuy, exchangeRate, activeInputType } = state.exchange;

    if (!selectedCurrencySellType || !selectedCurrencyBuyType || !selectedCurrencySell || !selectedCurrencyBuy || !exchangeRate || activeInputType !== "received") return;

    const currencySellAmount = calculateInputAmountBasedOnAnotherOne(action.payload, exchangeRate, "received");
    dispatch(setCurrencySellAmountValue(currencySellAmount));   
  },
});

exchangeSliceListener.startListening({
  actionCreator: setExchangeRate,
  effect: async (action, listenerApi) => {
    const dispatch = listenerApi.dispatch as AppDispatch;
    const state = listenerApi.getState() as RootState;
    const exchangeRate = action.payload
    const { selectedCurrencySellType, selectedCurrencyBuyType, selectedCurrencySell, selectedCurrencyBuy, activeInputType,  currencySellAmount } = state.exchange;

    if (!selectedCurrencySellType || !selectedCurrencyBuyType || !selectedCurrencySell || !selectedCurrencyBuy || activeInputType !== "given") return;

    const currencyBuyAmount = calculateInputAmountBasedOnAnotherOne(currencySellAmount.value, exchangeRate, "given");
    dispatch(setCurrencyBuyAmountValue(currencyBuyAmount));
  },
});



