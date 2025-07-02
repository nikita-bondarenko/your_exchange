import clsx from "clsx";
import React, { memo, ReactNode } from "react";

type ButtonProps = {
  className?: string;
  type: "primary" | "secondary" | "dark";
  children: ReactNode;
  onClick?: () => void;
  submit?: boolean
};

const Button: React.FC<ButtonProps> = memo(
  ({ className, type, children, onClick, submit }) => {

    return (
      <button
        onClick={onClick}
        type={submit ? "submit" : 'button'}
        className={clsx(
          className,
          "flex items-center justify-center w-full text-16 rounded-6 h-47",
          {
            "bg-[#F09810] text-white": type === "primary",
            "bg-[#F5F5F5] text-[#323232]": type === "secondary",
            "bg-[#262626] text-white": type === "dark",

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
