import { ExchangeTypeItemProps } from "@/components/exchange/ExchangeTypeItem";

export const exchangeTypesButtons: ExchangeTypeItemProps[] = [
  { icon: "crypt.svg", name: "Криптовалюту", type: "COIN" },
  { icon: "card.svg", name: "Безналичные", type: "BANK" },
  { icon: "cash.svg", name: "Наличные", type: "CASH" },
];
