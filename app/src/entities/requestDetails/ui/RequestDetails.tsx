import React, { memo } from "react";
import clsx from "clsx";
import { CurrencyType } from "@/shared/model/store/reducers/exchangeReducer";
import { Details, DetailsDescription, SectionHeadingProps } from "@/shared/ui";

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
      <>
        <Details
          label={currency.typeLabel}
          title={title}
          rate={rate}
          currency={{
            icon: currency.icon,
            name: currency.name,
          }}
          currencyAmount={currency.value}
        >
          <>
            {currency.wayDetails && (
              <DetailsDescription
                title={currency.wayDetails.title}
                description={currency.wayDetails.value}
                descriptionClassName={clsx({
                  "max-w-250 [&]:leading-normal break-all": currency.type === "COIN",
                  "tracking-[4px] break-all": currency.type === "BANK",
                })}
              />
   
            )}
          </>
        </Details>
  
      </>
    );
  }
);

RequestDetails.displayName = "RequestDetails";
