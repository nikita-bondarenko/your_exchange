"use client";
import ProcessLayout from "@/c__widgets/processLayout/ui";
import { useIsCardsFormValid } from "@/d__features/transferAbroad/lib";
import {
  TransferCurrencyInput,
  TransferPlatformInput,
} from "@/d__features/transferAbroad/ui";

import { useRouterPushCallback } from "@/shared/lib";

export default function TransferAbroadInputChinesePlatforms() {
  const { isFormValid } = useIsCardsFormValid();
  const [handleSubmit] = useRouterPushCallback({
    nextPagePath: "/transfer-abroad/details",
    isFormValid,
  });

  return (
    <ProcessLayout onMainButtonClick={handleSubmit} buttonText="Далее">
      <TransferCurrencyInput isLimitInfoActive={false} />
      <TransferPlatformInput />
    </ProcessLayout>
  );
}
