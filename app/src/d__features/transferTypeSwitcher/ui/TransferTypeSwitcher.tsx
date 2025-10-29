import {
  setTransferType,
  useAppDispatch,
  useAppSelector,
} from "@/shared/model/store";
import { Toggle } from "@/shared/ui";
import { memo, useEffect, useState } from "react";

export const TransferTypeSwitcher = memo(() => {
  const [isLegalEntity, setIsLegalEntity] = useState(true);

  const transferType = useAppSelector(
    (state) => state.transferAbroad.transferType
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (transferType === "individual") {
      setIsLegalEntity(false);
    } else if (transferType === "legal_entity") {
      setIsLegalEntity(true);
    }
  }, [transferType]);

  const handleToggle = (isLegalEntity: boolean) => {
    setIsLegalEntity(isLegalEntity);
    const transferType = isLegalEntity ? "legal_entity" : "individual";
    dispatch(setTransferType(transferType));
  };

  return (
    <Toggle
      firstButtonText="Юр. лица"
      secondButtonText="Физ. лица"
      isFirstSelected={isLegalEntity}
      setIsFirstSelected={handleToggle}
    ></Toggle>
  );
});

TransferTypeSwitcher.displayName = "TransferTypeSwitcher";
