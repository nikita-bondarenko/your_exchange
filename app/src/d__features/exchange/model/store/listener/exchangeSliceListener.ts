import {
  calculateSecondaryProperties,
  setInitialData,
  setIsRateBeingPulled,
} from "@/d__features/exchange/model/store/reducer/exchangeReducer";
import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
  setBanks,
  setCities,
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
  setIsPhoneNumberUsed,
} from "../reducer/exchangeReducer";
import { EXCHANGE_TYPES_BUTTONS } from "@/b__pages/exchangeType/config";
import { DirectionType } from "@/shared/model/api/exchange/types";
import { calculateInputAmountBasedOnAnotherOne } from "@/shared/lib/exchange/calculateInputAmountBasedOnAnotherOne";
import { setRateData } from "@/shared/lib/store/setRateData";
import {
  clearMyInterval,
  restartRatePullingIfActive,
  setMyInterval,
  updateRate,
} from "@/shared/lib/store";
import { RATE_INTERVAL_KEY } from "@/shared/config";
import { AppDispatch } from "../../../../../shared/model/store/appDispatch";
import { RootState } from "../../../../../shared/model/store/state";
import { exchangeApi } from "@/d__features/exchange/api";
import { ExchangeCurrencyType } from "@/shared/model/exchange";


export const filterReceiveVariants = (selectedGiveType: ExchangeCurrencyType) => {
  switch (selectedGiveType) {
    case "COIN": {
      return EXCHANGE_TYPES_BUTTONS.filter(
        (item) => item.type !== selectedGiveType
      );
    }
    default: {
      return EXCHANGE_TYPES_BUTTONS.filter((item) => item.type === "COIN");
    }
  }
};

export const exchangeSliceListener = createListenerMiddleware();

exchangeSliceListener.startListening({
  actionCreator: setSelectedCurrencySellType,
  effect: async (action, listenerApi) => {
    const dispatch = listenerApi.dispatch as AppDispatch;
    clearMyInterval(RATE_INTERVAL_KEY); // Clear auto-update when currency type changes
    const receiveVariants = filterReceiveVariants(
      action.payload as ExchangeCurrencyType
    );
    dispatch(setCurrencyBuyTypeOptions(receiveVariants));
    dispatch(setSelectedCurrencyBuyType(receiveVariants[0].type));
  },
});

exchangeSliceListener.startListening({
  actionCreator: setSelectedCurrencyBuyType,
  effect: async (action, listenerApi) => {
    const dispatch = listenerApi.dispatch as AppDispatch;
    clearMyInterval(RATE_INTERVAL_KEY); // Clear auto-update when currency type changes
    const state = listenerApi.getState() as RootState;
    const { selectedCurrencySellType } = state.exchange;

    const directionType = `${selectedCurrencySellType} - ${action.payload}`;
    const { data } = await listenerApi.dispatch(
      exchangeApi.endpoints.getDirectionInitialDataByDirectionType.initiate(
        {
          directionType,
        },
        { forceRefetch: true }
      )
    );

    const giveCurrencyId = data?.currencies_give
      ? data?.currencies_give[0].id
      : 0;
    if (giveCurrencyId === 0) {
      console.error("initial give currency is not found");
    }
    const { data: availableCurrenciesGet } = await listenerApi.dispatch(
      exchangeApi.endpoints.getCurrenciesGet.initiate(
        {
          currencyType: action.payload,
          giveCurrencyId: giveCurrencyId,
        },
        { forceRefetch: true }
      )
    );
    if (!data || !availableCurrenciesGet) {
      console.error("fetching initial data is not successfull");
      return;
    }

    dispatch(setInitialData({ initData: data, availableCurrenciesGet }));
    restartRatePullingIfActive(listenerApi, dispatch, RATE_INTERVAL_KEY);
  },
});

exchangeSliceListener.startListening({
  actionCreator: setSelectedCurrencySell,
  effect: async (action, listenerApi) => {
    clearMyInterval(RATE_INTERVAL_KEY); // Clear auto-update when currency changes

    const state = listenerApi.getState() as RootState;
    const selectedCurrencySell = action.payload;

    const {
      selectedCurrencySellType,
      selectedCurrencyBuyType,
      selectedBank,
      selectedCity,
      selectedCurrencyBuy,
      initialData,
      selectedNetwork,
    } = state.exchange;

    if (
      !selectedCurrencySell?.id ||
      !selectedCurrencyBuy?.id ||
      !selectedCurrencySellType ||
      !selectedCurrencyBuyType ||
      !initialData
    )
      return;

    let selectedNetworkValueId = selectedNetwork.value?.id;
    if (selectedCurrencySellType === "COIN") {
      console.log(
        "setSelectedNetworkValue setSelectedCurrencySellListener",
        selectedCurrencySell
      );

      listenerApi?.dispatch(
        setSelectedNetworkValue(selectedCurrencySell?.networks?.[0] || null)
      );

      if (selectedCurrencySell?.networks?.[0]) {
        selectedNetworkValueId = selectedCurrencySell?.networks?.[0].id;
      } else {
        selectedNetworkValueId = selectedCurrencySell.id;
      }

      listenerApi?.dispatch(
        setNetworks(selectedCurrencySell?.networks || null)
      );
    }

    if (selectedCurrencySellType === "CASH") {
      listenerApi?.dispatch(setSelectedCityValue(null));
    }
    if (selectedCurrencySellType === "BANK" && selectedCurrencySell?.banks) {
      // console.log("setSelectedBankValue setSelectedCurrencySell");
      listenerApi?.dispatch(
        setSelectedBankValue(selectedCurrencySell?.banks[0])
      );
      listenerApi?.dispatch(setBanks(selectedCurrencySell?.banks || null));
    }

    console.log("setRateData setSelectedNetworkValue setSelectedCurrencySell", {
      initialData,
      listenerApi,
      selectedBankId: selectedBank.value?.id,
      selectedCityId: selectedCity.value?.id,
      selectedCurrencyBuyId: selectedCurrencyBuy.id,
      selectedCurrencyBuyType: selectedCurrencyBuyType,
      selectedCurrencySellId: selectedCurrencySell.id,
      selectedCurrencySellType: selectedCurrencySellType,
      selectedNetworkValueId: selectedNetworkValueId,
    });

    await setRateData({
      initialData,
      listenerApi,
      selectedBankId: selectedBank.value?.id,
      selectedCityId: selectedCity.value?.id,
      selectedCurrencyBuyId: selectedCurrencyBuy.id,
      selectedCurrencyBuyType: selectedCurrencyBuyType,
      selectedCurrencySellId: selectedCurrencySell.id,
      selectedCurrencySellType: selectedCurrencySellType,
      selectedNetworkValueId: selectedNetworkValueId,
    });

    // if (
    //   selectedCurrencySell?.id === selectedCurrencySell?.id ||
    //   !selectedCurrencySell?.id ||
    //   !selectedCurrencyBuyType
    // )
    //   return;
    // const { data } = await listenerApi.dispatch(
    //   exchangeApi.endpoints.getCurrenciesGet.initiate(
    //     {
    //       giveCurrencyId: selectedCurrencySell?.id,
    //       currencyType: selectedCurrencyBuyType,
    //     },
    //     { forceRefetch: true }
    //   )
    // );

    // // console.log("getCurrenciesGet", data);

    // if (!data) return;
    // dispatch(setCurrenciesBuy(data));
    // dispatch(setSelectedCurrencyBuy(data?.[0] || null));
    // restartRatePullingIfActive(listenerApi, dispatch);
  },
});

exchangeSliceListener.startListening({
  actionCreator: setSelectedCurrencyBuy,
  effect: async (action, listenerApi) => {
    const dispatch = listenerApi.dispatch as AppDispatch;
    clearMyInterval(RATE_INTERVAL_KEY); // Clear auto-update when currency changes

    const state = listenerApi.getState() as RootState;
    const selectedCurrencyBuy = action.payload;
    const selectedCurrencyBuyNetwork =
      selectedCurrencyBuy?.networks && selectedCurrencyBuy?.networks[0];
    const selectedCurrencyBuyCity =
      selectedCurrencyBuy?.cities && selectedCurrencyBuy?.cities[0];
    const selectedCurrencyBuyBank =
      selectedCurrencyBuy?.banks && selectedCurrencyBuy?.banks[0];

    const {
      selectedCurrencySell,
      selectedCurrencySellType,
      selectedCurrencyBuyType,
      selectedBank,
      selectedCity,
      selectedNetwork,
    } = state.exchange;

    let selectedNetworkValueId = selectedNetwork.value?.id;

    if (selectedCurrencyBuyType === "COIN") {
      // // console.log(
      //   "setSelectedNetworkValue setSelectedCurrencyBuyListener",
      //   selectedCurrencyBuy?.networks?.[0]
      // );

      dispatch(
        setSelectedNetworkValue(selectedCurrencyBuy?.networks?.[0] || null)
      );
      dispatch(setNetworks(selectedCurrencyBuy?.networks || null));

      if (!selectedNetworkValueId) {
        selectedNetworkValueId = selectedCurrencyBuy?.id;
      }
    }

    if (selectedCurrencyBuyType === "CASH") {
      dispatch(setSelectedCityValue(null));
    }

    if (selectedCurrencyBuyType === "BANK") {
      const bank = selectedCurrencyBuy?.banks && selectedCurrencyBuy?.banks[0];
      if (selectedCurrencyBuy?.banks && bank) {
        dispatch(setSelectedBankValue(bank));
        dispatch(setBanks(selectedCurrencyBuy?.banks));
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
      exchangeApi.endpoints.rateList.initiate(
        {
          direction_type:
            `${selectedCurrencySellType} - ${selectedCurrencyBuyType}` as DirectionType,
          currency_give_id: selectedCurrencySell?.id,
          currency_get_id: selectedCurrencyBuy?.id,
          network_id: selectedNetworkValueId,
          bank_id: selectedCurrencyBuyBank?.id || selectedBank?.value?.id,
          city_id: selectedCurrencyBuyCity?.id || selectedCity?.value?.id,
        },
        { forceRefetch: true }
      )
    );
    if (!data) return;
    dispatch(setExchangeRate(data?.rate || null));
    const cities = calculateSecondaryProperties({
      rate: data?.rate,
      propertyKey: "cities",
    });
    dispatch(setCities(cities));
    restartRatePullingIfActive(listenerApi, dispatch, RATE_INTERVAL_KEY);
  },
});

exchangeSliceListener.startListening({
  actionCreator: setSelectedNetworkValue,
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const selectedNetworkValue = action.payload;
    const {
      selectedCurrencySell,
      selectedCurrencySellType,
      selectedCurrencyBuyType,
      selectedBank,
      selectedCity,
      selectedCurrencyBuy,
      initialData,
    } = state.exchange;

    if (
      !selectedCurrencySell?.id ||
      !selectedCurrencyBuy?.id ||
      !selectedCurrencySellType ||
      !selectedCurrencyBuyType ||
      !selectedNetworkValue ||
      !initialData
    )
      return;
    console.log("setRateData setSelectedNetworkValue setSelectedNetworkValue", {
      initialData,
      listenerApi,
      selectedBankId: selectedBank.value?.id,
      selectedCityId: selectedCity.value?.id,
      selectedCurrencyBuyId: selectedCurrencyBuy.id,
      selectedCurrencyBuyType: selectedCurrencyBuyType,
      selectedCurrencySellId: selectedCurrencySell.id,
      selectedCurrencySellType: selectedCurrencySellType,
      selectedNetworkValueId: selectedNetworkValue.id,
    });

    await setRateData({
      initialData,
      listenerApi,
      selectedBankId: selectedBank.value?.id,
      selectedCityId: selectedCity.value?.id,
      selectedCurrencyBuyId: selectedCurrencyBuy.id,
      selectedCurrencyBuyType: selectedCurrencyBuyType,
      selectedCurrencySellId: selectedCurrencySell.id,
      selectedCurrencySellType: selectedCurrencySellType,
      selectedNetworkValueId: selectedNetworkValue.id,
    });
  },
});

exchangeSliceListener.startListening({
  actionCreator: setSelectedBankValue,
  effect: async (action, listenerApi) => {
    const dispatch = listenerApi.dispatch as AppDispatch;
    const state = listenerApi.getState() as RootState;
    const selectedBankValue = action.payload;

    if (selectedBankValue?.name) {
      const isSpbBank = selectedBankValue.name.includes("СБП");

      dispatch(setIsPhoneNumberUsed(isSpbBank));
    } else {
      dispatch(setIsPhoneNumberUsed(false));
    }

    const {
      selectedCurrencySell,
      selectedCurrencySellType,
      selectedCurrencyBuyType,
      selectedBank,
      selectedCity,
      selectedCurrencyBuy,
      selectedNetwork,
      initialData,
    } = state.exchange;

    if (
      !selectedCurrencySell?.id ||
      !selectedCurrencyBuy?.id ||
      !selectedCurrencySellType ||
      !selectedCurrencyBuyType ||
      !initialData
    )
      return;

    let selectedNetworkId = selectedNetwork.value?.id;

    if (selectedCurrencySellType === "COIN" && !selectedNetwork.value?.id) {
      selectedNetworkId = selectedCurrencySell?.id;
    }

    if (selectedCurrencyBuyType === "COIN" && !selectedNetwork.value?.id) {
      selectedNetworkId = selectedCurrencySell?.id;
    }
    console.log(
      "setRateData setSelectedBankValue",
      selectedCurrencySell.id,
      selectedNetwork.value?.id
    );
    await setRateData({
      initialData,
      listenerApi,
      selectedBankId: selectedBank.value?.id,
      selectedCityId: selectedCity.value?.id,
      selectedCurrencyBuyId: selectedCurrencyBuy.id,
      selectedCurrencyBuyType: selectedCurrencyBuyType,
      selectedCurrencySellId: selectedCurrencySell.id,
      selectedCurrencySellType: selectedCurrencySellType,
      selectedNetworkValueId: selectedNetworkId,
    });
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
      !selectedCurrencyBuyType ||
      !selectedCityValue
    )
      return;

    const { data } = await listenerApi.dispatch(
      exchangeApi.endpoints.rateList.initiate(
        {
          direction_type:
            `${selectedCurrencySellType} - ${selectedCurrencyBuyType}` as DirectionType,
          currency_give_id: selectedCurrencySell?.id,
          currency_get_id: selectedCurrencyBuy?.id,
          network_id: selectedNetwork?.value?.id,
          bank_id: selectedBank?.value?.id,
          city_id: selectedCityValue?.id,
        },
        { forceRefetch: true }
      )
    );
    if (!data) return;
    dispatch(setExchangeRate(data?.rate || null));
    const cities = calculateSecondaryProperties({
      rate: data?.rate,
      propertyKey: "cities",
    });
    dispatch(setCities(cities));
    restartRatePullingIfActive(listenerApi, dispatch, RATE_INTERVAL_KEY);
  },
});

exchangeSliceListener.startListening({
  actionCreator: setCurrencySellAmountValue,
  effect: async (action, listenerApi) => {
    const dispatch = listenerApi.dispatch as AppDispatch;
    const state = listenerApi.getState() as RootState;
    const {
      selectedCurrencySellType,
      selectedCurrencyBuyType,
      selectedCurrencySell,
      selectedCurrencyBuy,
      exchangeRate,
      activeInputType,
    } = state.exchange;

    if (
      !selectedCurrencySellType ||
      !selectedCurrencyBuyType ||
      !selectedCurrencySell ||
      !selectedCurrencyBuy ||
      !exchangeRate ||
      activeInputType !== "given"
    )
      return;

    const currencyBuyAmount = calculateInputAmountBasedOnAnotherOne(
      action.payload,
      exchangeRate,
      "given"
    );
    dispatch(setCurrencyBuyAmountValue(currencyBuyAmount));
  },
});

exchangeSliceListener.startListening({
  actionCreator: setCurrencyBuyAmountValue,
  effect: async (action, listenerApi) => {
    const dispatch = listenerApi.dispatch as AppDispatch;
    const state = listenerApi.getState() as RootState;
    const {
      selectedCurrencySellType,
      selectedCurrencyBuyType,
      selectedCurrencySell,
      selectedCurrencyBuy,
      exchangeRate,
      activeInputType,
    } = state.exchange;

    if (
      !selectedCurrencySellType ||
      !selectedCurrencyBuyType ||
      !selectedCurrencySell ||
      !selectedCurrencyBuy ||
      !exchangeRate ||
      activeInputType !== "received"
    )
      return;

    const currencySellAmount = calculateInputAmountBasedOnAnotherOne(
      action.payload,
      exchangeRate,
      "received"
    );
    dispatch(setCurrencySellAmountValue(currencySellAmount));
  },
});

exchangeSliceListener.startListening({
  actionCreator: setExchangeRate,
  effect: async (action, listenerApi) => {
    const dispatch = listenerApi.dispatch as AppDispatch;
    const state = listenerApi.getState() as RootState;
    const exchangeRate = action.payload;
    const {
      selectedCurrencySellType,
      selectedCurrencyBuyType,
      selectedCurrencySell,
      selectedCurrencyBuy,
      activeInputType,
      currencySellAmount,
      isRateBeingPulled,
    } = state.exchange;

    if (
      !selectedCurrencySellType ||
      !selectedCurrencyBuyType ||
      !selectedCurrencySell ||
      !selectedCurrencyBuy ||
      activeInputType !== "given"
    )
      return;

    const currencyBuyAmount = calculateInputAmountBasedOnAnotherOne(
      currencySellAmount.value,
      exchangeRate,
      "given"
    );
    dispatch(setCurrencyBuyAmountValue(currencyBuyAmount));
  },
});

exchangeSliceListener.startListening({
  actionCreator: setIsRateBeingPulled,
  effect: async (action, listenerApi) => {

    if (action.payload === false) {
      clearMyInterval(RATE_INTERVAL_KEY);
    }

    if (action.payload === true) {
      clearMyInterval(RATE_INTERVAL_KEY);
      setMyInterval(() => updateRate(listenerApi), 30000, RATE_INTERVAL_KEY);
    }
  },
});
