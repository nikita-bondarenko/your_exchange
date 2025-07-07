import React from "react";
import clsx from "clsx";

type InputProps = {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = "text",
  className,
  onKeyDown,
}) => {
  return (
    <input
      type={type}
      className={clsx(
        "w-full bg-[#FFFFFF] outline-none text-16 text-black  px-16 py-8 ",
        className
      )}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
    />
  );
}; 