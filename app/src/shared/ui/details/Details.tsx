import clsx from "clsx";
import { SectionHeading, SectionHeadingProps } from "../exchange";
import { ReactNode } from "react";

type Props = SectionHeadingProps & {
  currency: {
    name: string;
    icon: string;
  };
  currencyAmount: string
  label?: string;
  children: ReactNode;
};

export const Details = ({
  title,
  rate,
  currency,
  label,
  children,
  currencyAmount
}: Props) => {
  return (
    <div className="">
      <SectionHeading title={title} rate={rate}></SectionHeading>
      <div className="bg-[var(--background-secondary)] rounded-6 px-20 py-24 flex flex-col gap-20">
        <div>
          <div className="mb-15 flex  items-center justify-between">
            <div className="flex  items-center gap-6">
              <img src={currency.icon} className={clsx("w-24 h-24")}></img>
              <span className="text-16 leading-normal text-[var(--text-main)]">
                {currency.name}
              </span>
            </div>
            <span className="text-16 leading-normal text-[var(--text-light)]">
              {label}
            </span>
          </div>
          <span className="text-21 leading-normal text-[var(--text-main)] font-normal">
            {currencyAmount}
          </span>
        </div>
        {children}
      </div>
    </div>
  );
};
