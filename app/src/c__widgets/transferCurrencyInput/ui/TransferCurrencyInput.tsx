import { SectionHeading } from "@/shared/ui";
import { memo, useEffect, useState } from "react";
import { LimitNote } from "./LimitNote";
import { CurrencyInput } from "@/entities/currency/ui";
import { TransferAbroadCurrency } from "@/shared/api";
import {
  setTransferAbroadCurrencyAmount,
  setTransferAbroadCurrencyName,
  useAppDispatch,
} from "@/shared/model/store";
import { useTransferCurrenciesOptions } from "../lib";

type Props = {
  isLimitInfoActive: boolean;
};

export const TransferCurrencyInput = memo(({ isLimitInfoActive }: Props) => {
  const { currencies } = useTransferCurrenciesOptions();

  const [currency, setCurrency] = useState<TransferAbroadCurrency>(
    currencies[0]
  );

  const [amount, setAmount] = useState<number | null>(1000);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currency) {
      dispatch(setTransferAbroadCurrencyName(currency.name));
    }
  }, [currency]);

  useEffect(() => {
    if (typeof amount === "number")
      dispatch(setTransferAbroadCurrencyAmount(amount));
  }, [amount]);

  return (
    <div>
      <SectionHeading
        title="Сумма и валюта"
        minValue={isLimitInfoActive ? currency.limit : null}
        conditionText="лимит"
        note={<LimitNote />}
      ></SectionHeading>
      <CurrencyInput
        options={currencies}
        inputValue={amount}
        onInputChange={setAmount}
        selectValue={currency}
        onSelectChange={setCurrency}
      ></CurrencyInput>
    </div>
  );
});

TransferCurrencyInput.displayName = "";
