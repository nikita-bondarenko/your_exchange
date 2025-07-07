"use client";
import RequestDetails from "@/components/request/RequestDetails";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setExchangeId, setIsLoading, setPageName } from "@/redux/slices/uiSlice";
import { selectExchangeCreateData, selectExchangeDetails } from "@/redux/selectors/exchangeDetailsSelector";
import React, { useCallback, useEffect } from "react";
import ExchangePageLayout from "@/components/exchange/ExchangePageLayout";
import { useRouter } from "next/navigation";
import { useExchangesCreateMutation } from "@/redux/api/cryptusApi";

export default function ExchangeDetailsPage() {
  const dispatch = useAppDispatch();
  const details = useAppSelector(selectExchangeDetails);
  const router = useRouter();
  useEffect(() => {
    dispatch(setPageName("подтверждение заявки"));
  }, [dispatch]);
const createExchangeData = useAppSelector(selectExchangeCreateData)
  const [createExchange] = useExchangesCreateMutation();

  const onSubmit = useCallback(() => { 
    createExchange(createExchangeData).unwrap().then((res) => {
      dispatch(setExchangeId(res.exchange_id));
      router.push("/exchange/result");
    })
  }, [router, dispatch,  createExchangeData]);

  return (
    <ExchangePageLayout onMainButtonClick={onSubmit} buttonText="Оставить заявку">
      <div className="flex flex-col gap-26"> {details.map((item, idx) => (
        <RequestDetails {...item} key={idx} />
      ))}
</div> 

     
    </ExchangePageLayout>
  );
}
