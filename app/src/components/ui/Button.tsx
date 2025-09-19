import clsx from "clsx";
import React, { memo, ReactNode } from "react";

type ButtonProps = {
  className?: string;
  type: "primary" | "secondary" | "bordary";
  children: ReactNode;
  onClick?: () => void;
  submit?: boolean;
  disabled?: boolean
};

const Button: React.FC<ButtonProps> = memo(
  ({ className, type, children, onClick, submit, disabled }) => {

    return (
      <button
        onClick={onClick}
        type={submit ? "submit" : 'button'}
        className={clsx(
          className,
          "flex items-center justify-center w-full text-16 rounded-6 h-47 transition-all",
          {
            "bg-[#323232] text-white": type === "primary",
            "bg-[#C0C0C0] text-[#323232]": type === "secondary",
            "bg-[#FFFFFF] text-[#434343] border-[1px] border-[#323232]": type === "bordary",
            "[&]:bg-[#C4C4C4] [&]:text-white [&]:pointer-events-none": disabled
          }
        )}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button"
export default Button;
