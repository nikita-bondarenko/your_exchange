import React, { memo } from "react";
import ExchangeTypeItem, { ExchangeTypeItemProps } from "./ExchangeTypeItem";
import { ExchangeCurrencyPosition } from "@/shared/model/exchange";

export type ExchangeTypeBlockProps = {
  title: string;
  buttons: ExchangeTypeItemProps[];
  position: ExchangeCurrencyPosition
};

const ExchangeTypeBlock: React.FC<ExchangeTypeBlockProps> = memo(
  ({ title, buttons, position }) => {

    return (
      <div className="relative rounded-6 bg-[var(--background-secondary)] overflow-hidden flex flex-col items-center after:absolute after:inset-0 after:border after:border-[var(--border-placeholder)] after:rounded-6 after:z-10 after:pointer-events-none text-[var(--text-main)]">
        <h2 className="py-15 px-19 w-full font-medium text-16 leading-normal">{title}</h2>
        {buttons.map((button) => (
          <ExchangeTypeItem {...button} key={button.type} position={position}></ExchangeTypeItem>
        ))}
      </div>
    );
  }
);

ExchangeTypeBlock.displayName = "ExchangeTypeBlock";

export default ExchangeTypeBlock;
