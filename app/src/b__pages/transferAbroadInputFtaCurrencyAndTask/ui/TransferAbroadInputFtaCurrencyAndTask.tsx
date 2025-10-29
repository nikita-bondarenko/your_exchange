import ProcessLayout from "@/c__widgets/processLayout/ui";
import { TransferCurrencyInput } from "@/c__widgets/transferCurrencyInput/ui";
import { useLockNextPage } from "@/d__features/transferAbroadNextPageLock/lib";
import { TaskDescriptionInput } from "@/entities/taskDescriptionInput/ui";
import { useRouterPushCallback } from "@/shared/lib";

export default function TransferAbroadInputFtaCurrencyAndTask() {
  const [handleSubmit] = useRouterPushCallback(
    "/transfer-abroad/input/fta/requisites-and-license"
  );

  useLockNextPage();

  return (
    <ProcessLayout onMainButtonClick={handleSubmit} buttonText="Далее">
      <TransferCurrencyInput isLimitInfoActive={false} />
      <TaskDescriptionInput></TaskDescriptionInput>
    </ProcessLayout>
  );
}
