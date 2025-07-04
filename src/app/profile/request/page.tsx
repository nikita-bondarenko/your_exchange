"use client";
import RequestDetails, {
  RequestDetailsProps,
} from "@/components/request/RequestDetails";
import {
  calculateCurrencyTypeFromDirection,
  Direction,
} from "@/helpers/calculateCurrencyTypeFromDirection";
import { calculateRate } from "@/helpers/calculateRate";
import { calculateWayDetails } from "@/helpers/calculateWayDetails";
import { findIcon } from "@/helpers/findIcon";
import { valueMask } from "@/helpers/valueMask";
import { roundTo8 } from "@/redux/helpers/roundTo8";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { setIsLoading, setPageName } from "@/redux/slices/uiSlice";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { CurrencyType } from "@/redux/slices/exchangeSlice/exchangeSlice";
import { RequestCurrency } from "@/redux/api/types";


const Page: React.FC = () => {
  const dispatch = useAppDispatch();
  const request = useAppSelector((state: RootState) => state.requestDetails.data);
  const router = useRouter();
  useEffect(() => {
    dispatch(setPageName(`заявка ${request?.id}`));
    dispatch(setIsLoading(false));
    if (!request) {
      router.push("/profile");
    }
  }, [request]);

  const requestDetails: RequestDetailsProps[] = useMemo(() => {
    if (!request) return [];

    const currencySellType = calculateCurrencyTypeFromDirection(
      request.direction_type as Direction,
      "given"
    );
    const currencyBuyType = calculateCurrencyTypeFromDirection(
      request.direction_type as Direction,
      "received"
    );
    const currencySellValue = valueMask(
      roundTo8(request.currency_give?.amount || 0)
    );
    const currencyBuyValue = valueMask(
      roundTo8(request.currency_get?.amount || 0)
    );
    const wayDetails = calculateWayDetails({
      direction: request.direction_type || "",
      position: "received",
      type: currencyBuyType,
      address: request.wallet,
      cardNumber: request.card,
      city: request.city,
      phoneNumber: request.card,
      isPhoneNumberUsed: request.currency_get?.bank?.includes("СБП"),
    });

    const calculateTypeLabel = (
      currencyType: CurrencyType,
      currency?: RequestCurrency
    ) => {
      return currencyType === "CASH"
        ? "Наличные"
        : currencyType === "BANK"
        ? currency?.bank || ""
        : currency?.network || "";
    };

    const currencySellTypeLabel = calculateTypeLabel(
      currencySellType,
      request.currency_give
    );
    const currencyBuyTypeLabel = calculateTypeLabel(
      currencyBuyType,
      request.currency_get
    );

    return [
      {
        title: "Я отдал",
        currency: {
          icon: request.currency_give?.icon || "",
          name: request.currency_give?.name || "",
          value: currencySellValue,
          type: currencySellType,
          typeLabel: currencySellTypeLabel,
          position: "given",
        },
        rate: calculateRate({
          course: request.course || 0,
          currencyGive: request.currency_give?.name || "",
          currencyGet: request.currency_get?.name || "",
        }),
      },
      {
        title: "Я получил",

        currency: {
          icon: request.currency_get?.icon || "",
          name: request.currency_get?.name || "",
          value: currencyBuyValue,
          type: currencyBuyType,
          typeLabel: currencyBuyTypeLabel,
          position: "received",
          wayDetails,
        },
      },
    ];
  }, [request]);

  if (!request) {
    return <div className="container mt-10">Заявка не найдена</div>;
  }

  return (
    <div className="container mt-10 flex flex-col gap-26">
      {requestDetails.map((request, index) => (
        <RequestDetails {...request} key={index}></RequestDetails>
      ))}
    </div>
  );
};

export default Page;
