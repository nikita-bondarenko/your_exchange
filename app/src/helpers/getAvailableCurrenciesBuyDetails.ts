import {
  Network,
  City,
  Bank,
  DirectionType,
  Currency,
  GetCurrenciesGetApiResponse,
  GetDirectionInitialDataByDirectionTypeApiResponse,
} from "@/redux/api/types";
import { calculateSecondaryProperties } from "@/redux/slices/exchangeSlice/exchangeSlice";
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
  } else
    currenciesBuy =
      initialData?.currencies_get?.filter((currency) =>
        availableCurrenciesGet.some((item) =>
          currency[currencyBuyType === "BANK" ? "banks" : "networks"].some(
            (option) => option.id === item.id
          )
        )
      ) || [];

  console.log(
    currenciesBuy,
    availableCurrenciesGet,
    initialData?.currencies_get
  );

  const isCurrencyBuyValid = currenciesBuy.some(
    (cur) => cur.id === selectedCurrencyBuyId
  );

  const isBankValid = currenciesBuy.some((cur) =>
    cur.banks.some((b) => b.id === selectedBankId)
  );

  const isNetworkValid = currenciesBuy.some((cur) =>
    cur.networks.some((n) => n.id === selectedNetworkId)
  );

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
        cur.banks.some((b) => b.id === bank.id)
      )
    );
    selectedCurrencyBuy.banks = banks;
  }

  if (currencyBuyType === "COIN" && selectedCurrencyBuy) {
    networks = networks.filter((network) =>
      availableCurrenciesGet.some((cur) =>
        cur.networks.some((n) => n.id === network.id)
      )
    );
    selectedCurrencyBuy.networks = networks;
  }

  console.log(banks);

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
