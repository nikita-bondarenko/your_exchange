import { CardIcon, CryptoIcon, CashIcon } from "@/shared/ui";
import { ExchangeTypeItemProps } from "../ui/exchangeTypeSelect/ExchangeTypeItem";

export const EXCHANGE_TYPES_BUTTONS: ExchangeTypeItemProps[] = [
    { icon: <CryptoIcon className="w-19 h-19"/>, name: "Криптовалюту", type: "COIN" },
    { icon: <CardIcon className="w-19 h-19"/>, name: "Безналичные", type: "BANK" },
    { icon: <CashIcon className="w-21 h-21 mr-[-2px]"/>, name: "Наличные", type: "CASH" },
  ];
  