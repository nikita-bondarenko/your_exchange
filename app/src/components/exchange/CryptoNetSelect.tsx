import clsx from "clsx";
import React, { memo } from "react";
import { Network } from "@/redux/api/types";

export type CryptoNetOption = Network;

export type CryptoNetSelectProps = {
  options: CryptoNetOption[];
  value: CryptoNetOption;
  onChange: (value: CryptoNetOption) => void;
};

const CryptoNetSelect: React.FC<CryptoNetSelectProps> = memo(
  ({ options, value, onChange }) => {
    return (
      <div className="flex gap-x-8 gap-y-11 flex-wrap">
        {options.map((option, index) => (
          <button
            onClick={() => onChange(option)}
            key={index}
            className={clsx(
              "border  border-[#FFFFFF] rounded-full bg-[#FFFFFF] text-[#B5B5B5] text-13 leading-normal duration-500 px-21 py-9",
              {
                "[&]:border-[#333333] [&]:bg-[#333333] [&]:text-white pointer-events-none":
                  value?.id === option?.id,
              }
            )}
          >
            {option.name}
          </button>
        ))}
      </div>
    );
  }
);

CryptoNetSelect.displayName = "CryptoNetSelect";

export default CryptoNetSelect;
