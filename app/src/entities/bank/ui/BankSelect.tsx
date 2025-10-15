import React, { memo, useState } from "react";
import clsx from "clsx";
import { InputWrapper } from "../../../shared/ui/form/InputWrapper";
import BaseSelect from "../../../shared/ui/form/BaseSelect";
import { Bank } from "@/shared/api/types";

export type BankOption = Bank;

export type BankSelectProps = {
  options: BankOption[];
  onChange: (value: BankOption | null) => void;
  value: BankOption | null;
  placeholder: string;
  error?: string | null;
};

export const BankSelect: React.FC<BankSelectProps> = memo(
  ({ options, onChange, value, placeholder, error }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <BaseSelect
        options={options}
        value={value}
        onChange={onChange}
        isOpen={isOpen}
        maxHeight={176}
        onOpenChange={setIsOpen}
        className="[&_button]:text-16 "
        renderTrigger={({ isOpen }) => (
          <InputWrapper error={error} errorIcon={false}>
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              tabIndex={-1}
              className={clsx(
                "relative w-full flex items-center justify-between px-16 py-15 rounded-6 border border-[#FFFFFF] bg-[#FFFFFF] text-13 transition-all duration-500",
                { "[&]:border-primary-red": !!error }
              )}
            >
              <div className="text-16 text-black">
                {value ? value.name : placeholder}
              </div>
              <div>
                <svg
                  className={`ml-2 w-15 h-15 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="#999999"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>
          </InputWrapper>
        )}
        renderOption={({ option, onClick }) => (
          <button
            className="shrink-0 px-18 py-9 text-left text-black w-full not-last:border-b not-last:border-[#B5B5B5]"
            key={option.id}
            onClick={onClick}
          >
            {option.name}
          </button>
        )}
      />
    );
  }
);

BankSelect.displayName = "BankSelect";

