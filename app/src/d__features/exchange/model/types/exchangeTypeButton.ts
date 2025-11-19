import { ExchangeCurrencyType, ExchangeCurrencyPosition } from "@/shared/model/exchange";
import { ReactNode } from "react";

export type ExchangeTypeButton = {
  icon: ReactNode ;
  name: string;
  type: ExchangeCurrencyType;
  position?: ExchangeCurrencyPosition;
};