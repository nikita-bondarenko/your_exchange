import React, { memo } from "react";
import clsx from "clsx";
import { Details, DetailsDescription } from "@/shared/ui";
import { ExchangeCurrencyDetails } from "@/shared/model/exchange/exchangeCurrencyDetails";
import { SectionHeading } from "@/shared/model/sectionHeading";

export type ExchangeRequestDetailsProps = {
  currency: ExchangeCurrencyDetails;
} & SectionHeading;

export const ExchangeRequestDetails: React.FC<ExchangeRequestDetailsProps> = memo(
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

ExchangeRequestDetails.displayName = "ExchangeRequestDetails";
