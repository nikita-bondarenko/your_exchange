import { Toggle } from "@/shared/ui";
import { memo, useState } from "react";

export const ModeSwitcher = memo(() => {
  const [isExchangeMode, setIsExchangeMode] = useState(true);

  return (
    <Toggle
      firstButtonText="Обмен криптовалют"
      secondButtonText="Платежи за рубеж"
      isFirstSelected={isExchangeMode}
      setIsFirstSelected={setIsExchangeMode}
    ></Toggle>
  );
});

ModeSwitcher.displayName = "ModeSwitcher";
