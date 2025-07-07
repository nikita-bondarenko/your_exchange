import { CurrencyPosition } from "@/components/request/RequestDetails";
import { HeadingRate } from "@/components/ui/SectionHeading";
import { Rate } from "@/redux/api/types";
import { roundTo8 } from "@/redux/helpers";
import { CurrencyType } from "@/redux/slices/exchangeSlice/exchangeSlice";

type calculatePlaceholderProps = {
  position: CurrencyPosition;
  minValue: number;
  rate: HeadingRate | null;
  currencyType: CurrencyType
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
