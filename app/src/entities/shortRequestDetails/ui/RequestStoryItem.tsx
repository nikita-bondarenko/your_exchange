import React, { memo } from "react";
import StoryCryptoData, { StoryCryptoDataProps } from "./StoryCryptoData";
import { useRouter } from "next/navigation";
import { valueMask } from "@/shared/lib/string/valueMask";
import { formatDate } from "@/shared/lib/string/formatDate";
import { setRequestDetails } from "@/shared/model/store/reducers/requestDetailsReducer";
import { useAppDispatch } from "@/shared/model/store/hooks";
import { roundTo8 } from "@/shared/lib/number/roundTo8";
import { ArrowRightIcon } from "@/shared/ui";
import { ExchangeRequest } from "@/shared/model/api";

export type RequestStoryItemProps = {
  data: ExchangeRequest;
};

const RequestStoryItem: React.FC<RequestStoryItemProps> = memo(({ data }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const goToRequestDetails = () => {

    dispatch(setRequestDetails(data));

    router.push("/profile/request");
  };
  return (
    <button onClick={goToRequestDetails} className="mb-26 w-full text-[var(--text-main)]">
     <div  className="flex justify-between items-center mb-9 text-13 leading-normal text-[var(--text-secondary)]">
        <span >{formatDate(data.date)}</span>
        <span >заявка {data.id}</span>
      </div>
      <div className="bg-[var(--background-secondary)] border border-[var(--border-placeholder)] rounded-6 px-19 py-14 grid grid-cols-2 relative">
        <StoryCryptoData
          name={data.currency_give?.name || ''}
          value={valueMask(roundTo8(data.currency_give?.amount || 0))}
          arrow
          icon={data.currency_give?.icon || ''}
        ></StoryCryptoData>
        <StoryCryptoData
          name={data.currency_get?.name || ''}
          value={valueMask(roundTo8(data.currency_get?.amount || 0))}
          icon={data.currency_get?.icon || ''}
        ></StoryCryptoData>
        <ArrowRightIcon
        color="var(--background-light)"
          className="w-7 h-10 center-y right-26"
        ></ArrowRightIcon>
      </div>
   
    </button>
  );
});

RequestStoryItem.displayName = "RequestStoryItem";

export default RequestStoryItem;
