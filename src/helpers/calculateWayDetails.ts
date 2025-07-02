import { CurrencyType } from "@/redux/slices/exchangeSlice/exchangeSlice";
import { Direction } from "./calculateCurrencyTypeFromDirection";

type WayDetails = {
  title: string;
  value: string;
}

type WayDetailsInput = {
  direction: Direction;
  position: "given" | "received";
  type: CurrencyType;
  address?: string;
  cardNumber?: string;
  city?: string;
}

export const calculateWayDetails = ({
  direction,
  position,
  type,
  address,
  cardNumber,
  city,
}: WayDetailsInput): WayDetails | undefined => {
  // Для позиции "received" (получаю)
  if (position === "received") {
    // Для криптовалюты
    if (type === "COIN" && address) {
      return {
        title: "Адрес получения",
        value: address,
      };
    }

    // Для банковской карты
    if (type === "BANK" && cardNumber) {
      return {
        title: "Карта получения",
        value: cardNumber,
      };
    }

    // Для наличных
    if (type === "CASH" && city) {
      return {
        title: "Город получения",
        value: city,
      };
    }
  }

  return undefined;
}; 