"use client"
import { CurrencyPosition } from "@/entities/requestDetails/ui/RequestDetails";
import { calculatePlaceholder } from "@/shared/lib/exchange/calculatePlaceholder";
import { valueMask } from "@/shared/lib/string/valueMask";
import { useAppSelector } from "@/shared/model/store/hooks";
import { selectRate } from "@/shared/model/store/selectors";
import { CurrencyType } from "@/shared/model/store/reducers/exchangeReducer";
import { useMemo } from "react";

export const usePlaceholder = (position: CurrencyPosition, currencyType:CurrencyType) => {
  const minValue = useAppSelector((state) => state.exchange.exchangeRate?.currency_give_min_value);
  const rate = useAppSelector(selectRate());
  const placeholder = useMemo(() => {
    return valueMask(calculatePlaceholder({ minValue: minValue || 0, rate, position, currencyType }));
  }, [minValue, rate, position]);
  return placeholder
};
