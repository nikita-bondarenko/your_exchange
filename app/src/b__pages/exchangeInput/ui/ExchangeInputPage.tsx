"use client";
import {Button} from "@/shared/ui/button";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { memo, useCallback, useEffect } from "react";
import { validateAllFields } from "@/shared/lib/validation";
import ExchangeInput from "@/c__widgets/exchangeInput/ui";
import { store } from "@/app/providers/storeProvider/lib";
import { setAreErrorsVisible, setIsRateBeingPulled } from "@/d__features/exchange/model";
import { useAppDispatch, useAppSelector, selectCurrencyTypes, setIsLoading } from "@/shared/model/store";

export default memo(function ExchangeInputPage() {
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
    dispatch(setIsLoading(false));
    dispatch(setIsRateBeingPulled(true)); // Start automatic rate updates
    return () => {
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
