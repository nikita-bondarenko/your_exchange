"use client";

import { useAppDispatch, useAppSelector } from "@/shared/model/store/hooks";
import { setIsLoading, setPageName } from "@/shared/model/store/reducers/uiReducer";
import { useRouter } from "next/navigation";
import React, { memo, useCallback, useEffect, useRef } from "react";
import { EXCHANGE_TYPES_BUTTONS } from "../config";
import { useCallSupport } from "@/d__features/support/lib";
import ExchangeLayout from "@/c__widgets/exchangeLayout/ui";
import RateNoteModal from "@/c__widgets/rateNoteModal/ui";
import ExchangeTypeBlock from "./exchangeTypeSelect/ExchangeTypeBlock";

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

  const giveOptions = useRef(EXCHANGE_TYPES_BUTTONS);
  

  return (
    <ExchangeLayout
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
        <div className="border-[1px] rounded-6 border-[#E9E9E9] bg-[var(--background-secondary)] w-full h-70 flex flex-col items-center justify-center">
          <p className="text-13 text-[#979797]">
            Не нашли интересующий тип обмена?
          </p>
          <button
            onClick={callSupport}
            className="text-13 font-medium text-[var(--text-main)] underline underline-offset-2"
          >
            связаться с поддержкой
          </button>
        </div>
      </div>
      <RateNoteModal/>
    </ExchangeLayout>
  );
});
