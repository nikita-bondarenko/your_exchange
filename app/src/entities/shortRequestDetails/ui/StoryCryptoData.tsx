import React from "react";
import Icon from "../../../shared/ui/media/Icon";
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
          <Icon server src={icon} className={clsx("w-13 h-13 shrink-0", {})}></Icon>
          <span className="text-13 leading-normal block translate-y-1">
            {name}
          </span>
        </div>
        {arrow && (
          <div className="relative flex flex-grow justify-end mr-21 max-w-57">
            <div className="center-y h-1 w-full bg-[#CFCFCF] right-4"></div>
            <Icon
              src="arrow-right.svg"
              className="w-8 h-8 shrink-0"
            ></Icon>
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
