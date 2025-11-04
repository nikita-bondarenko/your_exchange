"use client";

import ProcessLayout from "@/c__widgets/processLayout/ui";
import {
  TransferCurrencyInput,
  TaskDescriptionInput,
  TransferCountryInput,
} from "@/d__features/transferAbroad/ui";

import { useRouterPushCallback } from "@/shared/lib";
import { useIsInvoiceFormValid } from "@/d__features/transferAbroad/lib/useIsInvoiceFormValid";

export default function TransferAbroadInputInvoice() {
  const { isFormValid } = useIsInvoiceFormValid();
  const [handleSubmit] = useRouterPushCallback({
    nextPagePath: "/transfer-abroad/details",
    isFormValid,
  });

  

  return (
    <ProcessLayout onMainButtonClick={handleSubmit} buttonText="Далее">
      <TransferCurrencyInput isLimitInfoActive={false} />
      <TransferCountryInput />
      <TaskDescriptionInput />
    </ProcessLayout>
  );
}
