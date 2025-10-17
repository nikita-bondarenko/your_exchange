import React, { memo, useState } from "react";
import Icon from "../../../shared/ui/icon";
import BaseSelect from "../../../shared/ui/form/BaseSelect";
import { Currency } from "@/shared/api/types";



export type CurrencySelectProps = {
  options: Currency[];
  onChange: (value: Currency) => void;
  value: Currency;
};

const ButtonDisplay = memo(({ icon, name }: Currency) => (
  <span className="button-display flex items-start gap-6 overflow-hidden text-ellipsis text-16 text-[var(--text-main)]">
    <Icon src={icon} server className="w-24 h-24 shrink-0" />
    <span dangerouslySetInnerHTML={{__html:name}}></span>
  </span>
));

ButtonDisplay.displayName = "ButtonDisplay";

const CurrencySelect = memo(({ options, onChange, value: selected }: CurrencySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <BaseSelect
      options={options}
      value={selected}
      onChange={onChange}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      className="[&]:w-128"
      dropdownTop="top-[120%]"
      maxHeight={200}
      renderTrigger={({ isOpen }) => (
        <button
          type="button"
          className="w-full flex [&_.button-display]:items-center items-center justify-between px-16 py-10 border-l border-[#B5B5B5] bg-[var(--background-secondary)] text-16"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {selected ? (
            <ButtonDisplay {...selected} />
          ) : (
            <span className="text-[var(--text-main)]">Выбрать</span>
          )}
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
        </button>
      )}
      renderOption={({ option, onClick }) => (
        <button
          className="shrink-0 px-16 py-4 text-left w-full"
            key={option.id}
          onClick={onClick}
        >
          <ButtonDisplay {...option} />
        </button>
      )}
    />
  );
});

CurrencySelect.displayName = "CurrencySelect";

export default CurrencySelect;
