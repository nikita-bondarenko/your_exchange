import { ExchangeCurrencyPosition, ExchangeCurrencyType } from "@/shared/model/exchange";
import { HeadingRate } from "@/shared/ui";


type calculatePlaceholderProps = {
  position: ExchangeCurrencyPosition;
  minValue: number;
  rate: HeadingRate | null;
  currencyType: ExchangeCurrencyType
};
export const calculatePlaceholder = ({
  position,
  minValue,
  rate,
  currencyType
}: calculatePlaceholderProps) => {
  if (position === "given") {
    return minValue;
  } else {
    if (rate === null || rate?.from.value === null || rate?.to.value === null) return minValue;
    const result = (minValue / (rate?.from.value / rate?.to.value))
    return currencyType !== 'COIN' ? Number(result.toFixed(2)) : Number(result.toFixed(8));
  }
};
