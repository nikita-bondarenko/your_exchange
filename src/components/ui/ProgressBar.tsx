import Icon from "@/components/helpers/Icon";
import clsx from "clsx";

type ProgressBarProps = {
  currentStep: number;
  isBackward?: boolean;
  totalSteps?: number;
}

type StepProps = {
  isActive: boolean;
  isCompleted: boolean;
  delay?: boolean;
}

const Step: React.FC<StepProps> = ({ isActive, isCompleted, delay }) => (
  <div
    className={clsx(
      "w-20 h-20 border-2 border-[#333333] rounded-full flex items-center justify-center relative shrink-0",
      {
        "bg-[#333333]": isCompleted,
        "delay-500": delay,
      }
    )}
  >
    <Icon
      src="header-sign.svg"
      className={clsx(
        "w-10 h-10 opacity-0 top-5 center-x",
        {
          "[&]:opacity-100": isCompleted,
          "delay-500": delay,
        }
      )}
    />
  </div>
);

type ProgressLineProps = {
  currentStep: number;
  stepNumber: number;
  isBackward?: boolean;
}

const ProgressLine: React.FC<ProgressLineProps> = ({ currentStep, stepNumber, isBackward }) => {
  const getWidth = () => {
    if (currentStep < stepNumber) return "w-0";
    if (currentStep === stepNumber) return "w-26";
    return "w-52";
  };

  return (
    <div className="w-52 h-2 bg-[#CCCCCC] rounded-full relative">
      <div
        className={clsx(
          "h-2 bg-[#333333] rounded-full absolute top-0 left-0",
          {
            [getWidth()]: true,
            "delay-1000": isBackward && stepNumber === 1 || (!isBackward && stepNumber === 2 && currentStep !== 3),
          }
        )}
      />
    </div>
  );
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStep, 
  isBackward = false,
  totalSteps = 4 
}) => {
  return (
    <div className="flex items-center gap-5 [&_*]:transition-all [&_*]:duration-500">
      <div className="w-20 h-20 rounded-full relative shrink-0 bg-[#333333]">
        <Icon src="header-sign.svg" className="w-10 h-10 top-6 center-x" />
      </div>
      <ProgressLine currentStep={currentStep} stepNumber={1} isBackward={isBackward} />
      <Step isActive={currentStep >= 2} isCompleted={currentStep >= 2} delay />
      <ProgressLine currentStep={currentStep} stepNumber={2} isBackward={isBackward} />
      <Step isActive={currentStep >= 3} isCompleted={currentStep >= 3} delay />
    </div>
  );
}; 