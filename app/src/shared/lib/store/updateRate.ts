
import { exchangeApi } from "@/d__features/exchange/api";
import { setExchangeRate, setCurrencyBuyAmountValue, setCurrencySellAmountValue } from "@/d__features/exchange/model";
import { DirectionType } from "@/shared/model/api";
import { AppDispatch, RootState } from "@/shared/model/store";
import { calculateInputAmountBasedOnAnotherOne } from "../exchange/calculateInputAmountBasedOnAnotherOne";

  export const updateRate = async (listenerApi: any) => {
 const dispatch = listenerApi.dispatch as AppDispatch;  
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
            exchangeApi.endpoints.rateList.initiate(
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