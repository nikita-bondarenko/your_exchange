import { valueMask } from "@/helpers/valueMask";
import React, { memo, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Icon from "../helpers/Icon";

export type HeadingRate = {
  from: {
    value: number;
    name: string;
  };
  to: {
    value: number;
    name: string;
  };
};

export type SectionHeadingProps = {
  title: string;
  rate?: HeadingRate | undefined | null;
  minValue?: number | undefined;
  error?: boolean;
};

const SectionHeading: React.FC<SectionHeadingProps> = memo(
  ({ title, rate, minValue, error }) => {
    const [isMessageOpen, setIsMessageOpen] = useState(false);

    const timeout = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
      if (isMessageOpen) {
        timeout.current && clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
          setIsMessageOpen(false);
        }, 3000);
      }
    }, [isMessageOpen]);

    useEffect(() => {
      return () => {
        timeout.current && clearTimeout(timeout.current);
      };
    }, []);

    const handleMinValueClick: React.MouseEventHandler = () => {
      setIsMessageOpen(true);
    };
    return (
      <div className="flex items-end justify-between mb-10 pl-6  gap-10">
        <h2 className="text-16 font-medium leading-normal  shrink-0 min-w-100">
          {title}
        </h2>
        {rate && (
          <span
            className="text-13  leading-normal text-neutral-gray-1600 text-right"
            dangerouslySetInnerHTML={{
              __html: `${valueMask(rate?.from.value)} ${
                rate?.from.name
              } = <span class="text-black">${valueMask(
                rate?.to.value
              )}</span> ${rate?.to.name}`,
            }}
          ></span>
        )}
        {minValue && (
          <button onClick={handleMinValueClick} className=" block pl-17 max-w-200">
            <Icon
              src="alert.svg"
              className={clsx(
                "w-12 h-12 center-y left-0 opacity-0 transition-opacity duration-500",
                { "opacity-100": error }
              )}
            ></Icon>
            <Icon
              src="question.svg"
              className={clsx(
                "w-15 h-15 center-y left-0 opacity-0 transition-opacity duration-500",
                { "opacity-100": !error }
              )}
            ></Icon>
            <span
              className={clsx(
                "block text-13 leading-normal text-neutral-gray-1600  [&_span]:transition-all [&_span]:duration-500",
                {
                  "[&]:text-primary-red [&_span]:text-primary-red-strong":
                    error,
                }
              )}
            >
              <span className=" mr-6 ">минимально</span>
              <span
                className={clsx(
                  "text-black transition-all duration-500 whitespace-nowrap",
                  {
                    "text-primary-red-strong": error,
                  }
                )}
              >
                {valueMask(minValue)}
              </span>
            </span>
          </button>
        )}
        <div
          className={clsx(
            "fixed z-50 top-[121px] right-1/2 translate-x-1/2 w-[280px] px-[21px] py-[14px]  leading-[120%] border border-[#E9E9E9] bg-white rounded-[8px] transition-opacity duration-500",
            {
              "opacity-100 pointer-events-auto": isMessageOpen,
              "opacity-0 pointer-events-none": !isMessageOpen,
            }
          )}
        >
          <p className="text-black mb-[5px] text-[14px]">
            Минимальная сумма обмена может быть ниже
          </p>
          <span className="text-[#999999] text-[13px]">
            Уточните подробности у оператора
          </span>
        </div>
      </div>
    );
  }
);

SectionHeading.displayName = "SectionHeading";

export default SectionHeading;
