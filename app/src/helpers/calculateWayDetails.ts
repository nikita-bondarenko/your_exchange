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
  phoneNumber?: string;
  isPhoneNumberUsed?: boolean;
  city?: string;
}

export const calculateWayDetails = ({
  direction,
  position,
  type,
  address,
  cardNumber,
  phoneNumber,
  isPhoneNumberUsed,
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

    // Для банковской карты или СБП
    if (type === "BANK") {
      if (isPhoneNumberUsed && phoneNumber) {
        return {
          title: "Номер телефона",
          value: phoneNumber,
        };
      } else if (cardNumber) {
        return {
          title: "Карта получения",
          value: cardNumber,
        };
      }
    }

    // Для наличных
    if (type === "CASH" && city) {
      return {
        title: "Город получения",
        value: city,
      };
    }
  }

  // Для позиции "given" (отдаю)
  if (position === "given") {
    // Для криптовалюты
    if (type === "COIN" && address) {
      return {
        title: "Адрес отправления",
        value: address,
      };
    }

    // Для банковской карты или СБП
    if (type === "BANK") {
      if (isPhoneNumberUsed && phoneNumber) {
        return {
          title: "Номер телефона",
          value: phoneNumber,
        };
      } else if (cardNumber) {
        return {
          title: "Карта отправления",
          value: cardNumber,
        };
      }
    }

    // Для наличных
    if (type === "CASH" && city) {
      return {
        title: "Город отправления",
        value: city,
      };
    }
  }

  return undefined;
}; 