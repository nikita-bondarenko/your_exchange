import {
  calculateSecondaryProperties,
  CurrencyType,
  setAvailableCurrenciesGetData,
  setInitialData,
  setIsRateBeingPulled,
  setSelectedBankValueWithoutListening,
  setSelectedCurrencyBuyWithoutListening,
} from "@/shared/model/store/reducers/exchangeReducer";
import { createListenerMiddleware, PayloadAction } from "@reduxjs/toolkit";
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
} from "../../reducers/exchangeReducer";
import { AppDispatch, RootState } from "@/shared/model/store/store";
import { EXCHANGE_TYPES_BUTTONS } from "@/b__pages/exchangeType/config";
import { cryptusApi } from "@/shared/api/cryptusApi";
import { DirectionType } from "@/shared/api/types";
import { calculateInputAmountBasedOnAnotherOne } from "@/shared/lib/exchange/calculateInputAmountBasedOnAnotherOne";
import { getAvailableCurrenciesBuyDetails } from "@/shared/lib/currency/getAvailableCurrenciesBuyDetails";
import { setRateData } from "@/shared/lib/store/setRateData";

export const filterReceiveVariants = (selectedGiveType: CurrencyType) => {
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
    clearRateUpdateInterval(); // Clear auto-update when currency type changes
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
    clearRateUpdateInterval(); // Clear auto-update when currency type changes
    const state = listenerApi.getState() as RootState;
    const { selectedCurrencySellType } = state.exchange;

    const directionType = `${selectedCurrencySellType} - ${action.payload}`;
    const { data } = await listenerApi.dispatch(
      cryptusApi.endpoints.getDirectionInitialDataByDirectionType.initiate(
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
      cryptusApi.endpoints.getCurrenciesGet.initiate(
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
    // console.log(
    //   {
    //     currencyType: action.payload,
    //     giveCurrencyId: giveCurrencyId,
    //   },
    //   availableCurrenciesGet
    // );
    dispatch(setInitialData({ initData: data, availableCurrenciesGet }));
    restartRatePullingIfActive(listenerApi, dispatch);
  },
});

exchangeSliceListener.startListening({
  actionCreator: setSelectedCurrencySell,
  effect: async (action, listenerApi) => {
    clearRateUpdateInterval(); // Clear auto-update when currency changes

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
    if (selectedCurrencySellType === "BANK") {
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
    //   cryptusApi.endpoints.getCurrenciesGet.initiate(
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
    clearRateUpdateInterval(); // Clear auto-update when currency changes

    const state = listenerApi.getState() as RootState;
    const selectedCurrencyBuy = action.payload;
    const selectedCurrencyBuyNetwork = selectedCurrencyBuy?.networks[0];
    const selectedCurrencyBuyCity = selectedCurrencyBuy?.cities[0];
    const selectedCurrencyBuyBank = selectedCurrencyBuy?.banks[0];

    const {
      selectedCurrencySell,
      selectedCurrencySellType,
      selectedCurrencyBuyType,
      selectedBank,
      selectedCity,
      selectedNetwork,
    } = state.exchange;

    let selectedNetworkValueId = selectedNetwork.value?.id

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
        selectedNetworkValueId = selectedCurrencyBuy?.id
      }
    }

    if (selectedCurrencyBuyType === "CASH") {
      dispatch(setSelectedCityValue(null));
    }

    if (selectedCurrencyBuyType === "BANK") {
      const bank = selectedCurrencyBuy?.banks[0];
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
      cryptusApi.endpoints.rateList.initiate(
        {
          direction_type:
            `${selectedCurrencySellType} - ${selectedCurrencyBuyType}` as DirectionType,
          currency_give_id: selectedCurrencySell?.id,
          currency_get_id: selectedCurrencyBuy?.id,
          network_id:
            selectedNetworkValueId,
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
    restartRatePullingIfActive(listenerApi, dispatch);
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
      cryptusApi.endpoints.rateList.initiate(
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
    restartRatePullingIfActive(listenerApi, dispatch);
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

let rateUpdateInterval: NodeJS.Timeout | null = null;

// Cleanup function to clear rate update interval
const clearRateUpdateInterval = () => {
  if (rateUpdateInterval) {
    clearInterval(rateUpdateInterval);
    rateUpdateInterval = null;
  }
};

// Function to restart rate pulling after rate changes
export const restartRatePullingIfActive = (
  listenerApi: any,
  dispatch: AppDispatch
) => {
  const state = listenerApi.getState() as RootState;
  if (state.exchange.isRateBeingPulled && !rateUpdateInterval) {
    setTimeout(() => {
      dispatch(setIsRateBeingPulled(true));
    }, 100); // Small delay to ensure state is updated
  }
};

exchangeSliceListener.startListening({
  actionCreator: setIsRateBeingPulled,
  effect: async (action, listenerApi) => {
    const dispatch = listenerApi.dispatch as AppDispatch;
    const state = listenerApi.getState() as RootState;
    const {
      selectedCurrencySell,
      selectedCurrencySellType,
      selectedCurrencyBuyType,
      selectedNetwork,
      selectedBank,
      selectedCurrencyBuy,
      selectedCity,
      activeInputType,
      currencySellAmount,
      currencyBuyAmount,
    } = state.exchange;

    // Clear existing interval if it exists
    clearRateUpdateInterval();

    // If rate pulling is disabled, just return
    if (action.payload === false) {
      return;
    }

    // If rate pulling is enabled, start automatic updates
    if (action.payload === true) {
      const updateRate = async () => {
        const currentState = listenerApi.getState() as RootState;
        const {
          selectedCurrencySell: currentSelectedCurrencySell,
          selectedCurrencySellType: currentSelectedCurrencySellType,
          selectedCurrencyBuyType: currentSelectedCurrencyBuyType,
          selectedNetwork: currentSelectedNetwork,
          selectedBank: currentSelectedBank,
          selectedCurrencyBuy: currentSelectedCurrencyBuy,
          selectedCity: currentSelectedCity,
          activeInputType: currentActiveInputType,
          currencySellAmount: currentCurrencySellAmount,
          currencyBuyAmount: currentCurrencyBuyAmount,
          isRateBeingPulled: currentIsRateBeingPulled,
        } = currentState.exchange;

        // Stop updating if rate pulling was disabled
        if (!currentIsRateBeingPulled) {
          clearRateUpdateInterval();
          return;
        }

        if (
          !currentSelectedCurrencySell?.id ||
          !currentSelectedCurrencyBuy?.id ||
          !currentSelectedCurrencySellType ||
          !currentSelectedCurrencyBuyType
        ) {
          return;
        }

        try {
          const { data } = await listenerApi.dispatch(
            cryptusApi.endpoints.rateList.initiate(
              {
                direction_type:
                  `${currentSelectedCurrencySellType} - ${currentSelectedCurrencyBuyType}` as DirectionType,
                currency_give_id: currentSelectedCurrencySell?.id,
                currency_get_id: currentSelectedCurrencyBuy?.id,
                network_id: currentSelectedNetwork?.value?.id,
                bank_id: currentSelectedBank?.value?.id,
                city_id: currentSelectedCity.value?.id,
              },
              { forceRefetch: true }
            )
          );

          if (!data?.rate) {
            return;
          }

          // Update the rate
          dispatch(setExchangeRate(data.rate));

          // Recalculate amounts based on the last edited input
          if (
            currentActiveInputType === "given" &&
            currentCurrencySellAmount.value !== null
          ) {
            const newBuyAmount = calculateInputAmountBasedOnAnotherOne(
              currentCurrencySellAmount.value,
              data.rate,
              "given"
            );

            dispatch(setCurrencyBuyAmountValue(newBuyAmount));
          } else if (
            currentActiveInputType === "received" &&
            currentCurrencyBuyAmount.value !== null
          ) {
            const newSellAmount = calculateInputAmountBasedOnAnotherOne(
              currentCurrencyBuyAmount.value,
              data.rate,
              "received"
            );

            dispatch(setCurrencySellAmountValue(newSellAmount));
          } else {
          }
        } catch (error) {
          console.error(
            "[Rate Pulling] Failed to update exchange rate:",
            error
          );
        }
      };

      // Initial rate update
      await updateRate();

      // Set up interval for automatic updates every 30 seconds

      rateUpdateInterval = setInterval(updateRate, 30000);
    }
  },
});
