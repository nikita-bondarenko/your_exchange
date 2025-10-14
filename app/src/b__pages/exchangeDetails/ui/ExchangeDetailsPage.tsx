"use client";

import ExchangeLayout from "@/c__widgets/exchangeLayout/ui";
import PromoModal from "@/c__widgets/promocodeModal/ui";
import { RequestDetails } from "@/entities/requestDetails/ui";
import { useExchangesCreateMutation, useCheckPromocodeMutation } from "@/shared/api";
import { useAppDispatch, useAppSelector, selectExchangeDetails, setPageName, selectExchangeCreateData, setExchangeId, setPromocode, setIsPromocodeValid } from "@/shared/model/store";
import { Icon } from "@/shared/ui";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";


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
    <ExchangeLayout onMainButtonClick={onSubmit} buttonText="Оставить заявку">
      <div className="flex flex-col gap-26">
        {details.map((item, idx) => (
          <RequestDetails {...item} key={idx} />
        ))}
        <div className="bg-white rounded-6 px-20 py-15 flex items-center justify-center " >
          {
            !isPromoApplied ? <button className=" underline underline-offset-2" onClick={handlePromoButton}>У меня есть промокод</button>
              :
              <div className="flex items-center justify-center gap-[6px]">
                <p className="text-[#323232]">Промокод будет успешно применен</p>
                <Icon src="sign.svg" className="w-[16px] h-[16px] translate-y-[2px]"></Icon>
              </div>
          }
        </div>
     <div className="bg-white rounded-6 px-20 py-15 flex items-center justify-center ">
            <p className="text-center mx-auto">
              Курс обмена может меняться в&nbsp;зависимости
              от&nbsp;волатильности рынка. Итоговый курс сделки озвучит
              оператор.
            </p>
          </div>
      </div>
    </ExchangeLayout>
    <PromoModal handleCloseEvent={handlePromoModalCloseEvent} isErrorMessageShowing={isPromocodeErrorShowing} isOpen={isPromoModalOpen} onSubmit={handlePromocodeSubmit} value={promocode} setValue={setPromoCode}></PromoModal>
    </>
  );
}
