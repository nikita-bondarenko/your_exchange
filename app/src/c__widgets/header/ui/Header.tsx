"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import {
  setSelectedCurrencyBuyType,
  setSelectedCurrencySellType,
  useAppDispatch,
  useAppSelector,
} from "@/shared/model/store";
import { BACK_BUTTON_ROUTES, EXCHANGE_STEPS } from "@/shared/config";
import { ProgressBar } from "./ProgressBar";
import { Menu } from "./Menu";
import { CrossIcon, HeaderArrowIcon } from "@/shared/ui";

export function Header() {
  const pathname = usePathname();
  const pageName = useAppSelector((state) => state.ui.pageName);
  const isHome = useMemo(() => pathname === "/", [pathname]);
  const isAppReady = useAppSelector((state) => state.ui.isAppReady);

  const isProgressBarActive = useMemo(
    () => pathname?.startsWith("/exchange"),
    [pathname]
  );

  const isExchangeResultPage = useMemo(
    () => pathname?.startsWith("/exchange/result"),
    [pathname]
  );
  const router = useRouter();

  const backButton = useRef<HTMLButtonElement>(null);
  const [isBackward, setIsBackward] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsBackward(false);
    }, 200);
  }, [pathname]);

  const onBackButtonClick = () => {
    if (!isAppReady) return;
    const backButtonPath = BACK_BUTTON_ROUTES[pathname as string];
    if (isHome) {
      window.Telegram?.WebApp.close();
    } else {
      setIsBackward(true);
      router.push(backButtonPath);
    }
  };

  const currentStep = useMemo(() => {
    const idx = EXCHANGE_STEPS.findIndex((step) =>
      pathname.startsWith(step.path)
    );
    return idx === -1 ? null : idx;
  }, [pathname]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAppReady) {
      dispatch(setSelectedCurrencySellType("COIN"));
      dispatch(setSelectedCurrencyBuyType("BANK"));
    }
  }, [isAppReady]);
  const isPageNameVisible = useMemo(
    () => pathname.includes("profile") || pathname === "/faq",
    [pathname]
  );

  return (
    <div
      className={clsx(
        "container pt-33 pb-23 flex items-center justify-between transition-all duration-500 relative",
        {
          "[&]:h-18  [&]:opacity-0 [&]:pointer-events-none [&]:pt-9 [&]:pb-9":
            isHome,
        }
      )}
    >
      <div>
        <button
          ref={backButton}
          onClick={onBackButtonClick}
          className={clsx("flex gap-2 items-center", {
            "opacity-0 pointer-events-none": isExchangeResultPage,
          })}
        >
          <HeaderArrowIcon className="w-17 h-17" />
        </button>
      </div>
      {isPageNameVisible && (
        <span className="header__text  text-[var(--text-main)]">
          {pageName}
        </span>
      )}
      {isProgressBarActive && (
        <div className="flex items-center gap-5 [&_*]:transition-all [&_*]:duration-500">
          <ProgressBar currentStep={currentStep ?? 0} isBackward={isBackward} />
        </div>
      )}
      {isExchangeResultPage && (
        <button
          ref={backButton}
          onClick={onBackButtonClick}
          className="flex items-center justify-center relative w-16 h-16"
        >
          <CrossIcon className="w-12 h-12 transition-all duration-500 center"></CrossIcon>
        </button>
      )}
      {isExchangeResultPage && <Menu />}
    </div>
  );
}
