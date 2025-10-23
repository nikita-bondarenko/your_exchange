import { SectionHeading } from "@/shared/ui";
import { memo, useState } from "react";
import { LimitNote } from "./LimitNote";
import { CurrencyInput } from "@/entities/currency/ui";
import { Currency } from "@/shared/api";
import { currencyOptions } from "../mock";

export const TransferCurrencyInput = memo(() => {
  const [currency, setCurrency] = useState<Currency>(currencyOptions[0]);
  const [amount, setAmount] = useState<number | null>(null);
  return (
    <div>
      <SectionHeading
        title="Сумма и валюта"
        minValue={9999}
        conditionText="лимит"
        note={<LimitNote />}
      ></SectionHeading>
      <CurrencyInput
        options={currencyOptions}
        inputValue={amount}
        onInputChange={setAmount}
        selectValue={currency}
        onSelectChange={setCurrency}
      ></CurrencyInput>
    </div>
  );
});

TransferCurrencyInput.displayName = "";
