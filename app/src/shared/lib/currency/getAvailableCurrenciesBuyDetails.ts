import {
  Network,
  City,
  Bank,
  DirectionType,
  Currency,
  GetCurrenciesGetApiResponse,
  GetDirectionInitialDataByDirectionTypeApiResponse,
} from "@/shared/api/types";
import { calculateSecondaryProperties } from "@/shared/model/store/reducers/exchangeReducer";
import {
  calculateCurrencyTypeFromDirection,
  Direction,
} from "./calculateCurrencyTypeFromDirection";

type Props = {
  availableCurrenciesGet: GetCurrenciesGetApiResponse;
  initialData: GetDirectionInitialDataByDirectionTypeApiResponse;
  selectedCurrencyBuyId?: number;
  selectedCurrencySellId?: number;
  selectedNetworkId?: number;
  selectedBankId?: number;
};

export const getAvailableCurrenciesBuyDetails = ({
  availableCurrenciesGet,
  initialData,
  selectedCurrencyBuyId,
  selectedCurrencySellId,
  selectedNetworkId,
  selectedBankId,
}: Props) => {
  const currencyBuyType = calculateCurrencyTypeFromDirection(
    initialData?.rate?.direction_type as Direction,
    "received"
  );

  let currenciesBuy: Currency[] = initialData?.currencies_get || [];

  if (currencyBuyType === "CASH") {
    currenciesBuy =
      initialData?.currencies_get?.filter((currency) =>
        availableCurrenciesGet.some((cur) => cur.id === currency.id)
      ) || [];
  } else {
    const propertyName = currencyBuyType === "BANK" ? "banks" : "networks"
    currenciesBuy =
      initialData?.currencies_get?.filter((currency) =>
        availableCurrenciesGet.some((item) =>
          currency[propertyName]?.some(
            (option) => option.id === item.id
          )
        )
      ).map(cur => ({...cur, [propertyName]:cur[propertyName]?.filter(item => {
        const availableCurrency = availableCurrenciesGet.find(c => c.id === cur.id)
        if (!availableCurrency) return false
        return availableCurrency[propertyName]?.some(i => i.id === item.id)
      })})) || [];
  }

  if (currenciesBuy.length === 0) {
    currenciesBuy = availableCurrenciesGet;
  }

  // // console.log(
  //   currenciesBuy,
  //   availableCurrenciesGet,
  //   initialData?.currencies_get
  // );

  const isCurrencyBuyValid = currenciesBuy.some(
    (cur) => cur.id === selectedCurrencyBuyId
  );

  const isBankValid = currenciesBuy.some((cur) =>
    cur.banks?.some((b) => b.id === selectedBankId)
  );
  if (currencyBuyType === "COIN")
    console.log("selectedNetworkId", selectedNetworkId, currenciesBuy);

  const isNetworkValid = currenciesBuy.some((cur) =>
    cur.networks?.some((n) => n.id === selectedNetworkId)
  );

  // console.log(currenciesBuy);

  const selectedCurrencyBuy: Currency = JSON.parse(
    JSON.stringify(
      isCurrencyBuyValid
        ? currenciesBuy.find((cur) => cur.id === selectedCurrencyBuyId)
        : currenciesBuy[0]
    )
  );

  const calculateSecondaryPropertiesProps = {
    rate: initialData.rate,
    initialData: initialData,
    selectedCurrencyBuyId: isCurrencyBuyValid
      ? selectedCurrencyBuyId
      : currenciesBuy[0].id,
    selectedCurrencySellId,
  };

  let networks = calculateSecondaryProperties({
    ...calculateSecondaryPropertiesProps,
    propertyKey: "networks",
  });

  let banks = calculateSecondaryProperties({
    ...calculateSecondaryPropertiesProps,
    propertyKey: "banks",
  });

  if (currencyBuyType === "BANK" && selectedCurrencyBuy) {
    banks = banks.filter((bank) =>
      availableCurrenciesGet.some((cur) =>
        cur.banks?.some((b) => b.id === bank.id)
      )
    );
    if (banks.length === 0 && selectedCurrencyBuy.banks) {
      banks = selectedCurrencyBuy.banks;
    }
    selectedCurrencyBuy.banks = banks;
  }

  if (currencyBuyType === "COIN" && selectedCurrencyBuy) {
    networks = networks.filter((network) =>
      availableCurrenciesGet.some((cur) =>
        cur.networks?.some((n) => n.id === network.id)
      )
    );
    selectedCurrencyBuy.networks = networks;
  }

  // console.log(banks);

  return {
    selectedNetwork: networks[0] || null,
    selectedBank: banks[0] || null,
    networks,
    banks,
    selectedCurrencyBuy,
    currenciesBuy,
    isCurrencyBuyValid,
    isBankValid,
    isNetworkValid,
  };
};
