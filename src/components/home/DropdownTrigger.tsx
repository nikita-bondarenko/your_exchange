"use client"
import clsx from "clsx";
import { FC, ReactNode } from "react";
import Icon from "../helpers/Icon";

const DropdownTrigger: FC<{
  onClick?: () => void;
  children: ReactNode;
  arrow?: boolean;
  arrowPosition?: "top" | "bottom";
  border?: boolean;
  className?: string
}> = ({ onClick, children, arrowPosition, arrow, border,className }) => {
  return (
    <button
      className={clsx(
        "flex items-center justify-center gap-5 w-full h-50 bg-[#FFFFFF] text-black",
        className,
        {
          "border-top": border,
          
        }
      )}
      onClick={onClick}
    >
      <span className="text-16 ">{children}</span>
      {arrow && (
        <Icon
          src="arrow-top.svg"
          className={clsx(
            "w-11 h-11 transition-transform duration-500 translate-y-3",
            {
              "rotate-180 [&]:translate-y-0": arrowPosition !== "bottom",
            }
          )}
        ></Icon>
      )}
    </button>
  );
};

export default DropdownTrigger