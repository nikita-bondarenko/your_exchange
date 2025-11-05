import {
  setTransferTypeCategory,
  setTransferTypeCategorySlug,
  useAppDispatch,
  useAppSelector,
} from "@/shared/model/store";
import { Toggle } from "@/shared/ui";
import { memo, useEffect, useState } from "react";

export const TransferTypeCategorySwitcher = memo(() => {
  const [isLegalEntity, setIsLegalEntity] = useState(true);

  const transferTypeCategory = useAppSelector(
    (state) => state.transferAbroad.transferTypeCategory
  );

  
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (transferTypeCategory === "individual") {
      setIsLegalEntity(false);
    } else if (transferTypeCategory === "legal_entity") {
      setIsLegalEntity(true);
    }
  }, [transferTypeCategory]);

  const handleToggle = (isLegalEntity: boolean) => {
    setIsLegalEntity(isLegalEntity);
    const transferTypeCategory = isLegalEntity ? "legal_entity" : "individual";

    dispatch(setTransferTypeCategory(transferTypeCategory));
  };

  useEffect(() => {
    const transferTypeCategorySlug = isLegalEntity
      ? "Юр. Лица"
      : "Физ. Лица";
    dispatch(setTransferTypeCategorySlug(transferTypeCategorySlug));
  }, [isLegalEntity]);

  return (
    <Toggle
      firstButtonText="Юр. лица"
      secondButtonText="Физ. лица"
      isFirstSelected={isLegalEntity}
      setIsFirstSelected={handleToggle}
    ></Toggle>
  );
});

TransferTypeCategorySwitcher.displayName = "TransferTypeCategorySwitcher";
