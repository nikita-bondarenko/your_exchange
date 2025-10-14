import React from "react";
import clsx from "clsx";
import { Input } from "./Input";
import { InputWrapper } from "./InputWrapper";

const InputField: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}> = ({ value, onChange, onBlur, error, placeholder, disabled, className }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    if (onBlur) onBlur();
  };

  return (
    <InputWrapper error={error}>
      <Input
        onChange={handleChange}
        value={value}
        type="text"
        className={clsx(" border border-transparent rounded-6  placeholder:text-[#7B7B7B] text-16 leading-normal px-18 py-15 w-full", className)}
        placeholder={placeholder}
      />
    </InputWrapper>
  );
};

export default InputField;
