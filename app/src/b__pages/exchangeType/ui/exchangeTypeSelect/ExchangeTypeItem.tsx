import React, { memo, ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/model/store/hooks";
import clsx from "clsx";
import { CurrencyType, setSelectedCurrencyBuyType, setSelectedCurrencySellType } from "@/shared/model/store/reducers/exchangeReducer";
import { CurrencyPosition } from "@/entities/requestDetails/ui";
import { SignIcon } from "@/shared/ui";

export type ExchangeTypeItemProps = {
  icon: ReactNode;
  name: string;
  type: CurrencyType;
  position?: CurrencyPosition;
};

const ExchangeTypeItem: React.FC<ExchangeTypeItemProps> = memo(
  ({ icon, name, type, position }) => {
    const dispatch = useAppDispatch();

    const isSelected = useAppSelector((state) => {
      if (position === "received")
        return state.exchange.selectedCurrencyBuyType === type;
      else return state.exchange.selectedCurrencySellType === type;
    });
    const onClick = () => {
      if (position === "received") dispatch(setSelectedCurrencyBuyType(type));
      else dispatch(setSelectedCurrencySellType(type));
    };
    return (
      <button
        className={clsx(
          "h-46 flex items-center justify-between w-[101%] duration-500 transition-all bg-[var(--background-secondary)] px-18 relative",
          {
            "[&]:bg-[var(--background-exchange-type-selected)] pointer-events-none z-20": isSelected,
          }
        )}
        onClick={onClick}
      >
        <div className="flex items-center gap-11">
          {icon}
          <span className="text-16 leading-normal">{name}</span>
        </div>
        <SignIcon
          className={clsx(
            "w-16 h-16 opacity-0 duration-500 transition-opacity",
            { "[&]:opacity-100": isSelected }
          )}
        ></SignIcon>
      </button>
    );
  }
);

ExchangeTypeItem.displayName = "ExchangeTypeItem";

export default ExchangeTypeItem;
