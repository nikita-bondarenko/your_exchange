"use client";
import RequestDetails from "@/components/request/RequestDetails";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setExchangeId, setIsLoading, setPageName } from "@/redux/slices/uiSlice";
import { selectExchangeCreateData, selectExchangeDetails } from "@/redux/selectors/exchangeDetailsSelector";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ExchangePageLayout from "@/components/exchange/ExchangePageLayout";
import { useRouter } from "next/navigation";
import {  useCheckPromocodeMutation, useExchangesCreateMutation } from "@/redux/api/cryptusApi";
import Icon from "@/components/helpers/Icon";
import PromoModal from "@/components/exchange/PromoModal";
import { setIsPromocodeValid, setPromocode } from "@/redux/slices/exchangeSlice/exchangeSlice";

export default function ExchangeDetailsPage() {
  const dispatch = useAppDispatch();
  const details = useAppSelector(selectExchangeDetails);
  const router = useRouter();
  const [isPromoApplied, setIsPromoApplied] = useState(false)
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [promocode, setPromoCode] = useState('')
  const [isPromocodeErrorShowing,setIsPromocodeErrorShowing] = useState(false)
const timeoutId = useRef<NodeJS.Timeout>(null)

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
  }, [router, dispatch, createExchangeData]);

  const handlePromoButton = () => {
    setIsPromoModalOpen(true)
  }

  const handlePromoModalCloseEvent = () => {
    setIsPromoModalOpen(false)
  }

  const [checkPromocode] = useCheckPromocodeMutation()

  const handlePromocodeSubmit = async () => {

    const response = await checkPromocode({code: promocode})

    if (response.error) {
      setIsPromocodeErrorShowing(true)
      if (timeoutId.current )
      clearTimeout(timeoutId.current)
      timeoutId.current = setTimeout(() => {
        setIsPromocodeErrorShowing(false)
      },3000)
    } else {
      setIsPromoApplied(true)
      handlePromoModalCloseEvent()
      dispatch(setPromocode(promocode))
      dispatch(setIsPromocodeValid(true))
    }
  }

  return (
    <>
    <ExchangePageLayout onMainButtonClick={onSubmit} buttonText="Оставить заявку">
      <div className="flex flex-col gap-26">
        {details.map((item, idx) => (
          <RequestDetails {...item} key={idx} />
        ))}
        <div className="bg-white rounded-6 px-20 py-15 flex items-center justify-center text-13 leading-[107%]" >
          {
            !isPromoApplied ? <button className=" underline underline-offset-2" onClick={handlePromoButton}>У меня есть промокод</button>
              :
              <div className="flex items-center justify-center gap-[6px]">
                <p className="text-[#323232]">Промокод будет успешно применен</p>
                <Icon src="sign.svg" className="w-[16px] h-[16px] translate-y-[2px]"></Icon>
              </div>
          }
        </div>
      </div>
    </ExchangePageLayout>
    <PromoModal handleCloseEvent={handlePromoModalCloseEvent} isErrorMessageShowing={isPromocodeErrorShowing} isOpen={isPromoModalOpen} onSubmit={handlePromocodeSubmit} value={promocode} setValue={setPromoCode}></PromoModal>
    </>
  );
}
