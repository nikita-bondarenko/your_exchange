"use client";
import ExchangePageLayout from "@/components/exchange/ExchangePageLayout";
import ExchangeTypeBlock from "@/components/exchange/ExchangeTypeBlock";
import NoteModal from "@/components/exchange/NoteModal";
import { exchangeTypesButtons } from "@/data/exchangeTypesButtons";
import { useCallSupport } from "@/hooks/useCallSupport";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setIsLoading, setPageName } from "@/redux/slices/uiSlice";
import { store, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";

export default memo(function Page() {
  const recieveOptions = useAppSelector(
    (state) => state.exchange.currencyBuyTypeOptions
  );

  const router = useRouter();
  const dispatch = useAppDispatch();

  const onSubmit = useCallback(() => {
    router.push("/exchange/input");
  }, [router]);

  const { callSupport } = useCallSupport();

  useEffect(() => {
    dispatch(setPageName("выбор типа обмена"));
    dispatch(setIsLoading(false));
  }, [dispatch]);

  const giveOptions = useRef(exchangeTypesButtons);
  

  return (
    <ExchangePageLayout
      onMainButtonClick={onSubmit}
      buttonText="Подтвердить выбор"
    >
      <div className="flex flex-col gap-12 justify-between mb-50">
        <ExchangeTypeBlock
          position="given"
          title="Я отдаю"
          buttons={giveOptions.current}
        ></ExchangeTypeBlock>
        <ExchangeTypeBlock
          position="received"
          title="Я получаю"
          buttons={recieveOptions || []}
        ></ExchangeTypeBlock>
        <div className="border-[1px] rounded-6 border-[#E9E9E9] bg-[#FFFFFF] w-full h-70 flex flex-col items-center justify-center">
          <p className="text-13 text-[#979797]">
            Не нашли интересующий тип обмена?
          </p>
          <button
            onClick={callSupport}
            className="text-13 font-medium text-black underline underline-offset-2"
          >
            связаться с поддержкой
          </button>
        </div>
      </div>
      <NoteModal></NoteModal>
    </ExchangePageLayout>
  );
});
