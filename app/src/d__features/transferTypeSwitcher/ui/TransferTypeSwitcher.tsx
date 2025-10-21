
import { Toggle } from "@/shared/ui";
import { memo, useState } from "react";

export const TransferTypeSwitcher = memo(() => {
  const [isLegalEntity, setIsLegalEntity] = useState(true);

  return (
    <Toggle
      firstButtonText="Юр. лица"
      secondButtonText="Физ. лица"
      isFirstSelected={isLegalEntity}
      setIsFirstSelected={setIsLegalEntity}
    ></Toggle>
  );
});

TransferTypeSwitcher.displayName = "TransferTypeSwitcher";