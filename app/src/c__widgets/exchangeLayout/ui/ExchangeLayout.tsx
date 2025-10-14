import React, { memo, ReactNode } from "react";
import Button from "../../../shared/ui/button/Button";

export type ExchangeLayoutProps = {
  onMainButtonClick: () => void;
  buttonText: string;
  children: ReactNode;
};

const ExchangeLayout: React.FC<ExchangeLayoutProps> = memo(
  ({ onMainButtonClick, buttonText, children }) => {
    return (
      <div className="container h-full flex flex-col justify-between pb-0 gap-26 ">
        {children}
        <Button
          className="sticky bottom-0 z-30"
          type="primary"
          onClick={onMainButtonClick}
        >
          {buttonText}
        </Button>
      </div>
    );
  }
);

ExchangeLayout.displayName = "ExchangeLayout";

export default ExchangeLayout;
