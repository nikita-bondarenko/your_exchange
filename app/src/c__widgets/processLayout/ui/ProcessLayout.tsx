import React, { memo, ReactNode } from "react";
import { Button } from "../../../shared/ui/button/Button";

export type ProcessLayoutProps = {
  onMainButtonClick: () => void;
  buttonText: string;
  children: ReactNode;
  buttonDisabled?: boolean;
};

const ProcessLayout: React.FC<ProcessLayoutProps> = memo(
  ({ onMainButtonClick, buttonText, children, buttonDisabled }) => {
    return (
      <div className="container h-full flex flex-col justify-between pb-0 gap-26 ">
        <div className="flex flex-col gap-26 mb-5">{children}</div>
        <Button
          disabled={buttonDisabled}
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

ProcessLayout.displayName = "ProcessLayout";

export default ProcessLayout;
