"use client";
import ProcessLayout from "@/c__widgets/processLayout/ui";
import {
  TransferCurrencyInput,
  TaskDescriptionInput,
} from "@/d__features/transferAbroad/ui";

import { useRouterPushCallback } from "@/shared/lib";
import { useIsFtaCurrencyAndTaskFormValid } from "@/d__features/transferAbroad/lib/useIsFtaCurrencyAndTaskFormValid";

export default function TransferAbroadInputFtaCurrencyAndTask() {
  const { isFormValid } = useIsFtaCurrencyAndTaskFormValid();
  const [handleSubmit] = useRouterPushCallback({
    nextPagePath: "/transfer-abroad/input/fta/requisites-and-license",
    isFormValid,
  });

  return (
    <ProcessLayout onMainButtonClick={handleSubmit} buttonText="Далее">
      <TransferCurrencyInput isLimitInfoActive={false} />
      <TaskDescriptionInput />
    </ProcessLayout>
  );
}
