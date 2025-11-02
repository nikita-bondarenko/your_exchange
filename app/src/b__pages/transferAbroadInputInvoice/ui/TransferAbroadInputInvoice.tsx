"use client";

import ProcessLayout from "@/c__widgets/processLayout/ui";
import { TransferCurrencyInput, TaskDescriptionInput, TransferCountryInput } from "@/d__features/transferAbroad/ui";
import { useLockNextPage } from "@/d__features/transferAbroad/lib";
import { useRouterPushCallback } from "@/shared/lib";

export default function TransferAbroadInputInvoice() {
  const [handleSubmit] = useRouterPushCallback("/transfer-abroad/confirmation");

  useLockNextPage();

  return (
    <ProcessLayout onMainButtonClick={handleSubmit} buttonText="Далее">
      <TransferCurrencyInput isLimitInfoActive={false} />
      <TransferCountryInput />
      <TaskDescriptionInput />
    </ProcessLayout>
  );
}
