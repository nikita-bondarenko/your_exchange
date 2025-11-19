import { getAvailableCurrenciesBuyDetails } from "@/shared/lib/currency/getAvailableCurrenciesBuyDetails";
import {
  DirectionType,
  GetDirectionInitialDataByDirectionTypeApiResponse,
} from "@/shared/model/api";
import { restartRatePullingIfActive } from "./restartRatePullingIfActive";
import { AppDispatch } from "@/shared/model/store";
import { calculateSecondaryProperties } from "@/d__features/exchange/lib";
import {
  setCurrenciesBuy,
  setSelectedCurrencyBuyWithoutListening,
  setBanks,
  setSelectedBankValueWithoutListening,
  setNetworks,
  setSelectedNetworkValueWithoutListening,
  setExchangeRate,
  setCities,
  setGetRateLoading,
} from "@/d__features/exchange/model";
import { getCurrenciesAction, getRateAction } from "@/d__features/exchange/api";
import { setGetCurrenciesLoading } from "@/d__features/transferAbroad/model";

type Props = {
  dispatch: AppDispatch;
  initialData: GetDirectionInitialDataByDirectionTypeApiResponse;
  selectedCurrencySellType: string;
  selectedCurrencyBuyType: string;
  selectedCurrencySellId: number;
  selectedCurrencyBuyId: number;
  selectedNetworkValueId?: number;
  selectedBankId?: number;
  selectedCityId?: number;
  isRateBeingPulled: boolean
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
  dispatch,
  isRateBeingPulled
}: Props) => {
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

  dispatch(setGetCurrenciesLoading(true));
  const availableCurrenciesGet = await getCurrenciesAction({
    giveCurrencyId,
    currencyType: selectedCurrencyBuyType,
  });
  dispatch(setGetCurrenciesLoading(false));

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

  dispatch(setGetRateLoading(true))
  const rateData = await getRateAction(rateFetchingArgs)
  dispatch(setGetRateLoading(false))

  if (!rateData) return;
  dispatch(setExchangeRate(rateData?.rate || null));
  const cities = calculateSecondaryProperties({
    rate: rateData?.rate,
    propertyKey: "cities",
  });
  dispatch(setCities(cities));
  restartRatePullingIfActive(isRateBeingPulled, dispatch);
};
