import React from "react";
import  { ArrowRightIcon } from "../../../shared/ui/icon";
import clsx from "clsx";

export type StoryCryptoDataProps = {
  icon: string;
  name: string;
  value: string;
  arrow?: boolean;
};

const StoryCryptoData: React.FC<StoryCryptoDataProps> = ({
  icon,
  name,
  value,
  arrow,
}) => {
  return (
    <div className="flex flex-col">
      <div className=" flex items-center justify-between mb-8 gap-20">
        <div className="flex items-center gap-5 shrink-0">
          <img src={icon} className={clsx("w-13 h-13 shrink-0", {})}></img>
          <span className="text-13 leading-normal block translate-y-1">
            {name}
          </span>
        </div>
        {arrow && (
          <div className="relative flex flex-grow justify-end mr-21 max-w-57">
            <div className="center-y h-1 w-full bg-[var(--background-light)] right-4"></div>
            <ArrowRightIcon
            color="var(--background-light)"
              className="w-8 h-8 shrink-0"
            ></ArrowRightIcon>
          </div>
        )}
      </div>
      <span className="text-16 leading-normal break-all mr-24 text-left font-normal">
        {value}
      </span>
    </div>
  );
};

export default StoryCryptoData;
