import React, { memo } from "react";
import clsx from "clsx";
import { CurrencyType } from "@/shared/model/store/reducers/exchangeReducer";
import { SectionHeadingProps } from "@/shared/ui";
import SectionHeading from "@/shared/ui/exchange/SectionHeading";


export type CurrencyPosition = "given" | "received";

export type CurrencyDetails = {
  icon: string;
  name: string;
  value: string;
  type: CurrencyType;
  typeLabel: string;
  position: CurrencyPosition;
  wayDetails?: {
    title: string;
    value: string;
  };
};

export type RequestDetailsProps = {
  currency: CurrencyDetails;
} & SectionHeadingProps;

export const RequestDetails: React.FC<RequestDetailsProps> = memo(
  ({ title, rate, currency }) => {
    return (
      <div className="">
        <SectionHeading title={title} rate={rate}></SectionHeading>
        <div className="bg-[var(--background-secondary)] rounded-6 px-20 py-24 flex flex-col gap-20">
          <div>
            <div className="mb-15 flex  items-center justify-between">
              <div className="flex  items-center gap-6">
                <img
                  src={currency.icon}
                  className={clsx("w-24 h-24", {
                  })}
                ></img>
                <span className="text-16 leading-normal text-[var(--text-main)]">
                  {currency.name}
                </span>
              </div>
              <span className="text-16 leading-normal text-[var(--text-light)]">
                {currency.typeLabel}
              </span>
            </div>
            <span className="text-21 leading-normal text-[var(--text-main)] font-normal">{currency.value}</span>
          </div>
          {currency.wayDetails && (
            <div>
              <h3 className="text-[var(--text-light)] text-13 leading-normal mb-10">
                {currency.wayDetails.title}
              </h3>
              <span
                className={clsx("break-all text-16 leading-normal text-[var(--text-main)]", {
                  "max-w-250": currency.type === "COIN",
                  "tracking-[4px]": currency.type === "BANK",
                })}
              >
                {currency.wayDetails.value}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

RequestDetails.displayName = "RequestDetails";

