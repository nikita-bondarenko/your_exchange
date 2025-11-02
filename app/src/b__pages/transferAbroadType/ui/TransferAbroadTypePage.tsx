"use client";

import ProcessLayout from "@/c__widgets/processLayout/ui";
import { TransferTypeSwitcher } from "@/d__features/transferTypeSwitcher/ui";
import { TransferSelect } from "@/d__features/transferAbroad/ui";
import { useAppSelector } from "@/shared/model/store";
import { useRouter } from "next/navigation";
import { transferIdInputPathReferrencies } from "../config";
import { useMemo } from "react";

export default function TransferAbroadTypePage() {
  const router = useRouter();

  const selectedTranserTypeOptionId = useAppSelector(
    (state) => state.transferAbroad.selectedTranserTypeOptionId
  );

  const nextPagePath = useMemo(() => {
    if (!selectedTranserTypeOptionId) return;
    if (
      Object.keys(transferIdInputPathReferrencies).every(
        (key) => key !== selectedTranserTypeOptionId.toString()
      )
    ) {
      console.error(
        "current transferIdInputTypeReferrencies is not found in configuration"
      );
      return;
    }
    const inputType =
      // @ts-ignore this exeption is protected in previos condition
      transferIdInputPathReferrencies[selectedTranserTypeOptionId];
    return `/transfer-abroad/input/${inputType}`;
  }, [selectedTranserTypeOptionId]);

  const handleSubmit = () => {
    if (nextPagePath) router.push(nextPagePath);
  };

  return (
    <ProcessLayout
      onMainButtonClick={handleSubmit}
      buttonText="Подтвердить выбор"
    >
      <div className="flex flex-col gap-13">
        <TransferTypeSwitcher></TransferTypeSwitcher>
        <TransferSelect></TransferSelect>
      </div>
    </ProcessLayout>
  );
}
