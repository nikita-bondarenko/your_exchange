import { calculateSecondaryProperties, CurrencyType, setInitialData, setIsRateBeingPulled } from "@/redux/slices/exchangeSlice/exchangeSlice";
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
    clearRateUpdateInterval(); // Clear auto-update when currency type changes
    console.log('[Rate Pulling] Currency sell type changed, clearing interval');
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
    console.log('[Rate Pulling] Currency buy type changed, clearing interval');
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
    restartRatePullingIfActive(listenerApi, dispatch);
  },
});

exchangeSliceListener.startListening({
  actionCreator: setSelectedCurrencySell,
  effect: async (action, listenerApi) => {
    const dispatch = listenerApi.dispatch as AppDispatch;
    clearRateUpdateInterval(); // Clear auto-update when currency changes
    console.log('[Rate Pulling] Currency sell changed, will restart after new rate');
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
    restartRatePullingIfActive(listenerApi, dispatch);
  },
});

exchangeSliceListener.startListening({
  actionCreator: setSelectedCurrencyBuy,
  effect: async (action, listenerApi) => {
    const dispatch = listenerApi.dispatch as AppDispatch;
    clearRateUpdateInterval(); // Clear auto-update when currency changes
    console.log('[Rate Pulling] Currency buy changed, will restart after new rate');
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
    restartRatePullingIfActive(listenerApi, dispatch);
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
    restartRatePullingIfActive(listenerApi, dispatch);
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
    restartRatePullingIfActive(listenerApi, dispatch);
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
    restartRatePullingIfActive(listenerApi, dispatch);
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
    const { selectedCurrencySellType, selectedCurrencyBuyType, selectedCurrencySell, selectedCurrencyBuy, activeInputType, currencySellAmount, isRateBeingPulled } = state.exchange;

    if (!selectedCurrencySellType || !selectedCurrencyBuyType || !selectedCurrencySell || !selectedCurrencyBuy || activeInputType !== "given") return;

    const currencyBuyAmount = calculateInputAmountBasedOnAnotherOne(currencySellAmount.value, exchangeRate, "given");
    dispatch(setCurrencyBuyAmountValue(currencyBuyAmount));
  },
});

let rateUpdateInterval: NodeJS.Timeout | null = null;

// Cleanup function to clear rate update interval
const clearRateUpdateInterval = () => {
  if (rateUpdateInterval) {
    console.log('[Rate Pulling] Clearing rate update interval');
    clearInterval(rateUpdateInterval);
    rateUpdateInterval = null;
  }
};

// Function to restart rate pulling after rate changes
const restartRatePullingIfActive = (listenerApi: any, dispatch: AppDispatch) => {
  const state = listenerApi.getState() as RootState;
  if (state.exchange.isRateBeingPulled && !rateUpdateInterval) {
    console.log('[Rate Pulling] Restarting rate pulling after currency/parameter change');
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
      currencyBuyAmount
    } = state.exchange;

    console.log('[Rate Pulling] Action triggered:', action.payload);

    // Clear existing interval if it exists
    clearRateUpdateInterval();

    // If rate pulling is disabled, just return
    if (action.payload === false) {
      console.log('[Rate Pulling] Stopping automatic rate updates');
      return;
    }

    // If rate pulling is enabled, start automatic updates
    if (action.payload === true) {
      console.log('[Rate Pulling] Starting automatic rate updates every 10 seconds');
      console.log('[Rate Pulling] Current state:', {
        selectedCurrencySell: selectedCurrencySell?.name,
        selectedCurrencyBuy: selectedCurrencyBuy?.name,
        selectedCurrencySellType,
        selectedCurrencyBuyType,
        activeInputType,
        currencySellAmount: currencySellAmount.value,
        currencyBuyAmount: currencyBuyAmount.value
      });
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
          isRateBeingPulled: currentIsRateBeingPulled
        } = currentState.exchange;

        console.log('[Rate Pulling] Update rate triggered at:', new Date().toISOString());

        // Stop updating if rate pulling was disabled
        if (!currentIsRateBeingPulled) {
          console.log('[Rate Pulling] Rate pulling disabled, clearing interval');
          clearRateUpdateInterval();
          return;
        }

        if (
          !currentSelectedCurrencySell?.id ||
          !currentSelectedCurrencyBuy?.id ||
          !currentSelectedCurrencySellType ||
          !currentSelectedCurrencyBuyType 
        ) {
          console.log('[Rate Pulling] Missing required currencies or types, skipping update:', {
            selectedCurrencySell: currentSelectedCurrencySell?.name || 'null',
            selectedCurrencyBuy: currentSelectedCurrencyBuy?.name || 'null',
            selectedCurrencySellType: currentSelectedCurrencySellType || 'null',
            selectedCurrencyBuyType: currentSelectedCurrencyBuyType || 'null'
          });
          return;
        }

        console.log('[Rate Pulling] Fetching rate with params:', {
          direction_type: `${currentSelectedCurrencySellType} - ${currentSelectedCurrencyBuyType}`,
          currency_give_id: currentSelectedCurrencySell?.id,
          currency_get_id: currentSelectedCurrencyBuy?.id,
          network_id: currentSelectedNetwork?.value?.id,
          bank_id: currentSelectedBank?.value?.id,
          city_id: currentSelectedCity.value?.id,
        });

        try {
          const { data } = await listenerApi.dispatch(
            cryptusApi.endpoints.rateList.initiate({
              direction_type:
                `${currentSelectedCurrencySellType} - ${currentSelectedCurrencyBuyType}` as DirectionType,
              currency_give_id: currentSelectedCurrencySell?.id,
              currency_get_id: currentSelectedCurrencyBuy?.id,
              network_id: currentSelectedNetwork?.value?.id,
              bank_id: currentSelectedBank?.value?.id,
              city_id: currentSelectedCity.value?.id,
            })
          );
          
          if (!data?.rate) {
            console.log('[Rate Pulling] No rate data received');
            return;
          }
          
          console.log('[Rate Pulling] New rate received:', {
            oldRate: currentState.exchange.exchangeRate?.course,
            newRate: data.rate.course,
            rateDiff: data.rate.course - (currentState.exchange.exchangeRate?.course || 0)
          });
          
          // Update the rate
          dispatch(setExchangeRate(data.rate));
          
          // Recalculate amounts based on the last edited input
          if (currentActiveInputType === "given" && currentCurrencySellAmount.value !== null) {
            const newBuyAmount = calculateInputAmountBasedOnAnotherOne(
              currentCurrencySellAmount.value, 
              data.rate, 
              "given"
            );
            console.log('[Rate Pulling] Recalculating buy amount based on sell input:', {
              sellAmount: currentCurrencySellAmount.value,
              oldBuyAmount: currentCurrencyBuyAmount.value,
              newBuyAmount: newBuyAmount,
              newRate: data.rate.course
            });
            dispatch(setCurrencyBuyAmountValue(newBuyAmount));
          } else if (currentActiveInputType === "received" && currentCurrencyBuyAmount.value !== null) {
            const newSellAmount = calculateInputAmountBasedOnAnotherOne(
              currentCurrencyBuyAmount.value, 
              data.rate, 
              "received"
            );
            console.log('[Rate Pulling] Recalculating sell amount based on buy input:', {
              buyAmount: currentCurrencyBuyAmount.value,
              oldSellAmount: currentCurrencySellAmount.value,
              newSellAmount: newSellAmount,
              newRate: data.rate.course
            });
            dispatch(setCurrencySellAmountValue(newSellAmount));
          } else {
            console.log('[Rate Pulling] No amount recalculation needed:', {
              activeInputType: currentActiveInputType,
              sellAmount: currentCurrencySellAmount.value,
              buyAmount: currentCurrencyBuyAmount.value
            });
          }
        } catch (error) {
          console.error('[Rate Pulling] Failed to update exchange rate:', error);
        }
      };

      // Initial rate update
      console.log('[Rate Pulling] Performing initial rate update');
      await updateRate();
      
      // Set up interval for automatic updates every 10 seconds
      console.log('[Rate Pulling] Setting up interval for automatic updates every 10 seconds');
      rateUpdateInterval = setInterval(updateRate, 10000);
    }
  }
})



