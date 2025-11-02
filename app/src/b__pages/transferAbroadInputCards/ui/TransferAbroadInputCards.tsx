"use client";
import ProcessLayout from "@/c__widgets/processLayout/ui";
import { useLockNextPage } from "@/d__features/transferAbroad/lib";
import {
  TransferBankSelect,
  TransferCardNumberInput,
  TransferCurrencyInput,
} from "@/d__features/transferAbroad/ui";
import { useRouterPushCallback } from "@/shared/lib";

export default function TransferAbroadInputCards() {
  const [handleSubmit] = useRouterPushCallback("/transfer-abroad/confirmation");

  useLockNextPage();

  return (
    <ProcessLayout onMainButtonClick={handleSubmit} buttonText="Далее">
      <TransferCurrencyInput isLimitInfoActive={true} />
      <TransferBankSelect />
      <TransferCardNumberInput />
    </ProcessLayout>
  );
}
