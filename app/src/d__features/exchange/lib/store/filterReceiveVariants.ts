import { ExchangeCurrencyType } from "@/shared/model/exchange";
import { EXCHANGE_TYPES_BUTTONS } from "../../config";

export const filterReceiveVariants = (selectedGiveType: ExchangeCurrencyType) => {
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