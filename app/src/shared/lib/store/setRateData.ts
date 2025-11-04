import { getAvailableCurrenciesBuyDetails } from "@/shared/lib/currency/getAvailableCurrenciesBuyDetails";
import { exchangeApi } from "@/shared/api";
import {
  DirectionType,
  GetDirectionInitialDataByDirectionTypeApiResponse,
} from "../../api/exchange/types";
import { AppDispatch } from "../../model/store/store";
import {
  setCurrenciesBuy,
  setSelectedCurrencyBuyWithoutListening,
  setBanks,
  setSelectedBankValueWithoutListening,
  setExchangeRate,
  calculateSecondaryProperties,
  setCities,
  setNetworks,
  setSelectedNetworkValueWithoutListening,
} from "../../model/store/reducers/exchangeReducer";
import {
  ListenerEffectAPI,
  ThunkDispatch,
  UnknownAction,
} from "@reduxjs/toolkit";
import { restartRatePullingIfActive } from "./restartRatePullingIfActive";
import { RATE_INTERVAL_KEY } from "@/shared/config";

type Props = {
  listenerApi: ListenerEffectAPI<
    unknown,
    ThunkDispatch<unknown, unknown, UnknownAction>,
    unknown
  >;
  initialData: GetDirectionInitialDataByDirectionTypeApiResponse;
  selectedCurrencySellType: string;
  selectedCurrencyBuyType: string;
  selectedCurrencySellId: number;
  selectedCurrencyBuyId: number;
  selectedNetworkValueId?: number;
  selectedBankId?: number;
  selectedCityId?: number;
};

export const setRateData = async ({
  initialData,
  selectedBankId,
  selectedCityId,
  selectedCurrencyBuyId,
  selectedCurrencyBuyType,
  selectedCurrencySellId,
  selectedCurrencySellType,
  selectedNetworkValueId,
  listenerApi,
}: Props) => {
  const dispatch = listenerApi.dispatch as AppDispatch;
  const rateFetchingArgs = {
    direction_type:
      `${selectedCurrencySellType} - ${selectedCurrencyBuyType}` as DirectionType,
    currency_give_id: selectedCurrencySellId,
    currency_get_id: selectedCurrencyBuyId,
    network_id: selectedNetworkValueId,
    bank_id: selectedBankId,
    city_id: selectedCityId,
  };

  let giveCurrencyId: number = selectedCurrencySellId;

  if (selectedCurrencySellType === "COIN") {
    console.log("COIN", selectedNetworkValueId);

    const isSelectedNetworkValueIdValid =
      !!initialData.currencies_give
        ?.find((cur) => cur.id === selectedCurrencySellId)
        ?.networks?.find((net) => net.id === selectedNetworkValueId) ||
      !!initialData.currencies_give?.find(
        (cur) => cur.id === selectedNetworkValueId
      );

    if (selectedNetworkValueId && isSelectedNetworkValueIdValid)
      giveCurrencyId = selectedNetworkValueId;
    else {
      console.error("selectedNetworkValueId undefined or invalid");
      return;
    }
  }

  if (selectedCurrencySellType === "BANK") {
    // console.log("BANK", selectedBankId);
    if (selectedBankId) giveCurrencyId = selectedBankId;
    else {
      console.error("selectedBankId undefined");
      return;
    }
  }

  // // console.log('availableCurrenciesGet ARGS', {
  //   giveCurrencyId,
  //   currencyType: selectedCurrencyBuyType,
  // })

  const { data: availableCurrenciesGet } = await dispatch(
    exchangeApi.endpoints.getCurrenciesGet.initiate(
      {
        giveCurrencyId,
        currencyType: selectedCurrencyBuyType,
      },
      {
        forceRefetch: true,
      }
    )
  );

  // console.log("availableCurrenciesGet", availableCurrenciesGet);

  const {
    currenciesBuy,
    selectedBank,
    selectedNetwork,
    selectedCurrencyBuy: newSelectedCurrencyBuy,
    banks,
    networks,
    isBankValid,
    isCurrencyBuyValid,
    isNetworkValid,
  } = getAvailableCurrenciesBuyDetails({
    initialData: initialData,
    availableCurrenciesGet: availableCurrenciesGet || [],
    selectedBankId: rateFetchingArgs.bank_id,
    selectedNetworkId: rateFetchingArgs.network_id,
    selectedCurrencyBuyId: rateFetchingArgs.currency_get_id,
    selectedCurrencySellId: rateFetchingArgs.currency_give_id,
  });
  if (selectedCurrencyBuyType === "COIN" && selectedCurrencySellType === "CASH")
    console.log("getAvailableCurrenciesBuyDetails", networks, isNetworkValid);

  dispatch(setCurrenciesBuy(currenciesBuy));

  if (!isCurrencyBuyValid && newSelectedCurrencyBuy) {
    rateFetchingArgs.currency_get_id = newSelectedCurrencyBuy.id;

    dispatch(setSelectedCurrencyBuyWithoutListening(newSelectedCurrencyBuy));
  }

  if (!isBankValid && selectedCurrencyBuyType === "BANK") {
    rateFetchingArgs.bank_id = selectedBank.id;
    dispatch(setBanks(banks));
    dispatch(setSelectedBankValueWithoutListening(selectedBank));
  }

  if (selectedCurrencyBuyType === "COIN") {
    dispatch(setNetworks(networks));
    if (!isNetworkValid) {
      rateFetchingArgs.network_id = selectedNetwork.id;
      dispatch(setSelectedNetworkValueWithoutListening(selectedNetwork));
    }
  }

  // if ()

  // console.log(rateFetchingArgs);

  const { data } = await dispatch(
    exchangeApi.endpoints.rateList.initiate(rateFetchingArgs, {
      forceRefetch: true,
    })
  );

  if (!data) return;
  dispatch(setExchangeRate(data?.rate || null));
  const cities = calculateSecondaryProperties({
    rate: data?.rate,
    propertyKey: "cities",
  });
  dispatch(setCities(cities));
  restartRatePullingIfActive(listenerApi, dispatch, RATE_INTERVAL_KEY);
};
