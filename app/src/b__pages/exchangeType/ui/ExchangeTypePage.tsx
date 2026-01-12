"use client";

import { useAppDispatch, useAppSelector } from "@/shared/model/store/hooks";
import {
  setIsLoading,
  setPageName,
} from "@/shared/model/store/reducers/uiReducer";
import { useRouter } from "next/navigation";
import React, { memo, useCallback, useEffect, useRef } from "react";
import { useCallSupport } from "@/d__features/support/lib";
import ExchangeLayout from "@/c__widgets/processLayout/ui";
import RateNoteModal from "@/c__widgets/rateNoteModal/ui";
import ExchangeTypeBlock from "./exchangeTypeSelect/ExchangeTypeBlock";
import { EXCHANGE_TYPES_BUTTONS } from "@/d__features/exchange/config";
import {
  useSetInitDirections,
  useSetSelectedCurrencyTypesEffect,
  useSetSelectedCurrencySellTypeEffect,
} from "@/d__features/exchange/lib";
import { useTrackUserAction } from "@/d__features/userDataDisplay/lib";
import { useDebounce } from "@/shared/lib";

export default memo(function Page() {
  const sessionId = useAppSelector((state) => state.user.sessionId);
  const selectedCurrencyBuyType = useAppSelector(
    (state) => state.exchange.selectedCurrencyBuyType
  );
  const selectedCurrencySellType = useAppSelector(
    (state) => state.exchange.selectedCurrencySellType
  );
  const userId = useAppSelector((state) => state.user.id);
  const isAppReady = useAppSelector((state) => state.ui.isAppReady);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const onSubmit = useCallback(() => {
    router.push("/exchange/input");
  }, [router]);

  const { callSupport } = useCallSupport({ userId, isAppReady });
  const { trackUserAction } = useTrackUserAction();

  useEffect(() => {
    dispatch(setPageName("выбор типа обмена"));
    dispatch(setIsLoading(false));
  }, [dispatch]);

  useSetInitDirections();

  const { receiveTypesVariants } = useSetSelectedCurrencySellTypeEffect();
  useSetSelectedCurrencyTypesEffect();

  const { debounce } = useDebounce()

  useEffect(() => {
    if (sessionId && selectedCurrencyBuyType && selectedCurrencySellType) {
      const direction = `${selectedCurrencySellType} - ${selectedCurrencyBuyType}`;
      debounce(() => trackUserAction(`Выбрано направление ${direction}`))
    }
  }, [sessionId, selectedCurrencyBuyType, selectedCurrencySellType]);

  return (
    <ExchangeLayout onMainButtonClick={onSubmit} buttonText="Подтвердить выбор">
      <div className="flex flex-col gap-12 justify-between mb-50">
        <ExchangeTypeBlock
          position="given"
          title="Я отдаю"
          buttons={EXCHANGE_TYPES_BUTTONS}
        ></ExchangeTypeBlock>
        <ExchangeTypeBlock
          position="received"
          title="Я получаю"
          buttons={receiveTypesVariants}
        ></ExchangeTypeBlock>
        <div className="border-[1px] rounded-6 border-[var(--border-main)] bg-[var(--background-secondary)] w-full h-70 flex flex-col items-center justify-center">
          <p className="text-13 text-[var(--text-secondary)]">
            Не нашли интересующий тип обмена?
          </p>
          <button
            id='exchange-type-page-support'
            data-tracking-label="Связаться с поддержкой"
            onClick={callSupport}
            className="text-13 font-medium text-[var(--text-main)] underline underline-offset-2"
          >
            связаться с поддержкой
          </button>
        </div>
      </div>
      <RateNoteModal />
    </ExchangeLayout>
  );
});
