"use client";
import ProcessLayout from "@/c__widgets/processLayout/ui";
import {
  TransferCurrencyInput,
  TaskDescriptionInput,
} from "@/d__features/transferAbroad/ui";
import { useLockNextPage } from "@/d__features/transferAbroad/lib";
import { useRouterPushCallback } from "@/shared/lib";

export default function TransferAbroadInputFtaCurrencyAndTask() {
  const [handleSubmit] = useRouterPushCallback(
    "/transfer-abroad/input/fta/requisites-and-license"
  );

  useLockNextPage();

  return (
    <ProcessLayout onMainButtonClick={handleSubmit} buttonText="Далее">
      <TransferCurrencyInput isLimitInfoActive={false} />
      <TaskDescriptionInput />
    </ProcessLayout>
  );
}
