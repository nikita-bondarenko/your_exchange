import React, { memo } from "react";
import StoryCryptoData, { StoryCryptoDataProps } from "./StoryCryptoData";
import Icon from "../helpers/Icon";
import { useRouter } from "next/navigation";
import { valueMask } from "@/helpers/valueMask";
import { formatDate } from "@/helpers/formatDate";
import { roundTo8 } from "@/redux/helpers";
import { setRequestDetails } from "@/redux/slices/requestDetailsSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Request } from "@/redux/api/types";

export type RequestStoryItemProps = {
  data: Request;
};

const RequestStoryItem: React.FC<RequestStoryItemProps> = memo(({ data }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const goToRequestDetails = () => {
    // console.log('goToRequestDetails',data)

    dispatch(setRequestDetails(data));

    router.push("/profile/request");
  };
  return (
    <button onClick={goToRequestDetails} className="mb-26 w-full text-black">
     <div className="flex justify-between items-center mb-9">
        <span className="story-info">{formatDate(data.date)}</span>
        <span className="story-info">заявка {data.id}</span>
      </div>
      <div className="bg-[#FFFFFF] border border-[#FFFFFF] rounded-6 px-19 py-14 grid grid-cols-2 relative">
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
        <Icon
          src="arrow-right.svg"
          className="w-7 h-10 center-y right-26"
        ></Icon>
      </div>
   
    </button>
  );
});

RequestStoryItem.displayName = "RequestStoryItem";

export default RequestStoryItem;
