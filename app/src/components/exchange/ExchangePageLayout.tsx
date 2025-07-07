import React, { memo, ReactNode } from "react";
import Button from "../ui/Button";

export type ExchangePageLayoutProps = {
  onMainButtonClick: () => void;
  buttonText: string;
  children: ReactNode;
};

const ExchangePageLayout: React.FC<ExchangePageLayoutProps> = memo(
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

ExchangePageLayout.displayName = "ExchangePageLayout";

export default ExchangePageLayout;
