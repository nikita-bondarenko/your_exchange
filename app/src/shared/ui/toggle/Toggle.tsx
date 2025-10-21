import { clsx } from "clsx";
import { useRef } from "react";

type Props = {
  isFirstSelected: boolean;
  setIsFirstSelected: (isFirstSelected: boolean) => void;
  firstButtonText: string;
  secondButtonText: string;
};

export const Toggle = ({
  isFirstSelected,
  setIsFirstSelected,
  firstButtonText,
  secondButtonText,
}: Props) => {
  const buttons = useRef([
    {
      text: firstButtonText,
      onClick: () => setIsFirstSelected(true),
      selected: (isFirstSelected: boolean) => isFirstSelected,
    },
    {
      text: secondButtonText,
      onClick: () => setIsFirstSelected(false),
      selected: (isFirstSelected: boolean) => !isFirstSelected,
    },
  ]);

  return (
    <div className="bg-[var(--background-secondary)] relative border border-[var(--border-placeholder)] rounded-full text-13 text-[var(--text-main)] flex">
      {buttons.current.map((button, index) => (
        <button
          key={index}
          className={clsx(
            "h-31 w-1/2 transition-colors bg-transparent z-20 relative duration-500",
            {
              "[&]:text-[var(--text-button-main)]":
                button.selected(isFirstSelected),
            }
          )}
          onClick={button.onClick}
        >
          {button.text}
        </button>
      ))}
      <div
        className={clsx(
          "absolute top-2 left-2 h-27 w-[calc(50%-2px)] bg-[var(--main-color)] transition-transform rounded-full duration-500",
          { "translate-x-[100%]": !isFirstSelected }
        )}
      ></div>
    </div>
  );
};
