import { toggleMode, useAppDispatch, useAppSelector } from "@/shared/model/store";
import { Toggle } from "@/shared/ui";
import { memo, useState } from "react";

export const ModeSwitcher = memo(() => {
  const isExchangeMode = useAppSelector(
    (state) => state.featuresFlags.isExchangeMode
  );
  const isTransferAbroadMode = useAppSelector(
    (state) => state.featuresFlags.isTransferAbroadMode
  );

  const dispatch = useAppDispatch()

  const handleToggle = () => {
    dispatch(toggleMode())
  }

  return (
    <Toggle
      firstButtonText="Обмен криптовалют"
      secondButtonText="Платежи за рубеж"
      isFirstSelected={isExchangeMode && !isTransferAbroadMode}
      setIsFirstSelected={handleToggle}
    ></Toggle>
  );
});

ModeSwitcher.displayName = "ModeSwitcher";
