import { CurrencyPosition } from "@/entities/requestDetails/ui/RequestDetails";
import React, { memo } from "react";
import ExchangeCardInput from "./ExchangeCardInput";
import ExchangeCashInput from "./ExchangeCashInput";
import ExchangeCryptoInput from "./ExchangeCryptoInput";


export type ExchangeInputProps = {
  position: CurrencyPosition;
  type: "BANK" | "CASH" | "COIN" | null;
};

const ExchangeInput: React.FC<ExchangeInputProps> = memo(({ position, type }) => {
  
  switch (type) {
    case "BANK":
      return <ExchangeCardInput position={position} />;
    case "CASH":
      return <ExchangeCashInput position={position} />;
    case "COIN":
      return <ExchangeCryptoInput position={position} />;
    default:
      return null;
  }
});

ExchangeInput.displayName = "ExchangeInput";

export default ExchangeInput; 