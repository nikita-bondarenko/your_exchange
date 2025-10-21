import { SignIcon } from "@/shared/ui";
import clsx from "clsx";
import { createRef, memo, useEffect, useState } from "react";

export type TransferType = {
  id: number;
  icon: string;
  name: string;
  description: string;
};

type Props = TransferType & {
  iconClassName?: string;
  className?: string;
  isSelected: boolean;
  onClick: () => void;
};

export const TransferSelectItem = memo(
  ({ icon, className, iconClassName, name, description, isSelected, onClick }: Props) => {
    const [wrapperElementHeight, setWrapperElementHeight] =
      useState<string>("0");
    const descriptionElement = createRef<HTMLDivElement>();

    useEffect(() => {
      if (descriptionElement.current) {
        if (isSelected) {
          const wrapperHeight = descriptionElement.current?.clientHeight + "px";
          setWrapperElementHeight(wrapperHeight);
        } else {
          setWrapperElementHeight("0");
        }
      }
    }, [isSelected]);

    return (
      <div
        onClick={onClick}
        className={clsx("px-[17px] pt-[14px] w-full", {
          "bg-[var(--background-exchange-type-selected)]": isSelected,
        })}
      >
        <div className="pb-[12px] flex items-center justify-between">
          <div className={clsx("flex items-center gap-11", className)}>
            <img
              className={clsx("w-21 h-21", iconClassName)}
              src={icon}
              alt=""
            />
            <span className="text-16 leading-[107%] text-[var(--text-main)]">
              {name}
            </span>
          </div>
          <SignIcon
            className={clsx("w-16 h-16 transition-opacity duration-500", {
              "opacity-0": !isSelected,
            })}
          ></SignIcon>
        </div>
        <div
          className="relative duration-500 transition-all overflow-hidden"
          style={{ height: wrapperElementHeight }}
        >
          <div
            className="pb-[14px] pt-[2px] absolute button-0 left-0 text-[var(--text-secondary)] text-13 leading-[107%]"
            ref={descriptionElement}
            dangerouslySetInnerHTML={{ __html: description }}
          ></div>
        </div>
      </div>
    );
  }
);

TransferSelectItem.displayName = "TransferSelectItem";
