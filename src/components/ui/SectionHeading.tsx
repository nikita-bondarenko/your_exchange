import { valueMask } from '@/helpers/valueMask';
import React, { memo } from 'react';
import clsx from 'clsx';
import Icon from '../helpers/Icon';

export type HeadingRate = {
  from: {
    value: number;
    name: string;
  };
  to: {
    value: number;
    name: string;
  };
}

export type SectionHeadingProps = {
    title: string;
    rate?: HeadingRate | undefined | null;
    minValue?: number | undefined;
    error?: boolean
}

const SectionHeading: React.FC<SectionHeadingProps> = memo(({title,rate, minValue, error}) => {

  return (
     <div className="flex items-end justify-between mb-10 pl-6  gap-10">
          <h2 className="text-16 font-medium leading-normal  shrink-0 min-w-100 text-black">{title}</h2>
          {rate && (
            <span
              className="text-13  leading-normal text-[#999999] text-right"
              dangerouslySetInnerHTML={{
                __html: `${valueMask(rate?.from.value)} ${rate?.from.name} = <span class="text-black">${valueMask(rate?.to.value)}</span> ${rate?.to.name}`,
              }}
            ></span>
          )}
          {minValue && (
              <span className='relative block pl-17 max-w-200'>
                <Icon src='alert.svg' className={clsx('w-12 h-12 center-y left-0 opacity-0 transition-opacity duration-500', {"opacity-100": error})}></Icon>
                 <span
              className={clsx("block text-13 leading-normal text-[#999999]  [&_span]:transition-all [&_span]:duration-500", {
                "[&]:text-primary-red [&_span]:text-primary-red-strong": error
              })}
          
            >
              <span className=' mr-6 '>минимально</span>
              <span className={clsx("text-[#999999] transition-all duration-500 blackspace-nowrap", {
                "text-primary-red-strong": error
              })}>{valueMask(minValue)}</span>
            </span>
              </span>
          )}
        </div>
  );
});

SectionHeading.displayName = "SectionHeading"

export default SectionHeading;