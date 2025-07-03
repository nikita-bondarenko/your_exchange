"use client";
import Button from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setIsLoading, setPageName } from "@/redux/slices/uiSlice";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { memo, useCallback, useEffect, useMemo } from "react";
import { store } from "@/redux/store";
import ExchangeInput from "@/components/exchange/ExchangeInput";
import { validateAllFields } from "@/redux/helpers/validateAllFields";
import { selectCurrencyTypes } from "@/redux/selectors";
import { setAreErrorsVisible, setIsRateBeingPulled } from "@/redux/slices/exchangeSlice/exchangeSlice";

export default memo(function Page() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = useCallback(() => {
    dispatch(setAreErrorsVisible(true));
    const state = store.getState();
    const areErrors = validateAllFields(state, dispatch);
    if (areErrors) {
      return;
    }

    router.push("/exchange/details");
  }, [dispatch, router]);


  const {givenType, receivedType} = useAppSelector(selectCurrencyTypes);

  useEffect(() => {
    console.log('[Exchange Input Page] Component mounted, starting rate pulling');
    dispatch(setIsLoading(false));
    dispatch(setIsRateBeingPulled(true)); // Start automatic rate updates
    return () => {
      console.log('[Exchange Input Page] Component unmounting, stopping rate pulling');
      dispatch(setAreErrorsVisible(false));
      dispatch(setIsRateBeingPulled(false)); // Stop automatic rate updates
    };
  }, [dispatch]);

  return (
    <div className="container">
      <div
        className={clsx("flex flex-col gap-30 mb-22 ")}
      >
        <ExchangeInput position={'given'} type={givenType}></ExchangeInput>
        <ExchangeInput position={'received'} type={receivedType}></ExchangeInput>
      </div>
      <Button type="primary" onClick={onSubmit}>
        Далее
      </Button>
    </div>
  );
});
