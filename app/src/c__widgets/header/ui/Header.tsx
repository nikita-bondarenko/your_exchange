"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/model/store";
import clsx from "clsx";
import { useClickOutside } from "@/shared/lib/browser";
import {
  setUserId,
  setSelectedCurrencyBuyType,
  setSelectedCurrencySellType,
} from "@/shared/model/store";
import { BACK_BUTTON_ROUTES, EXCHANGE_STEPS, TEST_USER_ID } from "@/shared/config";
import { useCallSupport } from "@/d__features/support/lib";
import {Icon} from "@/shared/ui/media";
import { ProgressBar } from "./ProgressBar";

export default function Header() {
  const pathname = usePathname();
  const pageName = useAppSelector((state) => state.ui.pageName);
  const isHome = useMemo(() => pathname === "/", [pathname]);
  const isAppReady = useAppSelector((state) => state.ui.isAppReady);

  const isExchange = useMemo(
    () => pathname?.startsWith("/exchange"),
    [pathname]
  );

  const isExchangeResult = useMemo(
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
      window.Telegram.WebApp.close();
    } else {
      setIsBackward(true);
      router.push(backButtonPath);
    }
  };

  // --- Dropdown menu logic ---
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuToggle = () => {
    setMenuOpen((v) => !v);
  };

  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  useClickOutside<HTMLDivElement, HTMLButtonElement>(
    menuRef,
    menuButtonRef,
    () => setMenuOpen(false)
  );

  // --- Stepper logic ---
  const currentStep = useMemo(() => {
    const idx = EXCHANGE_STEPS.findIndex((step) =>
      pathname.startsWith(step.path)
    );
    return idx === -1 ? null : idx;
  }, [pathname]);

  const { callSupport } = useCallSupport();

  const handleMakeQuestion = () => {
    callSupport();
  };
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAppReady) return;

    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      dispatch(setUserId(window.Telegram.WebApp.initDataUnsafe.user.id));
    }

    if (process.env.NODE_ENV === "development") {
      dispatch(setUserId(TEST_USER_ID));
    }
  }, [dispatch, isAppReady]);

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
      {/* Back button */}{" "}
      <div>
    
          <button
            ref={backButton}
            onClick={onBackButtonClick}
            className={clsx("flex gap-2 items-center", {
              "opacity-0 pointer-events-none": isExchangeResult
            })}
          >
            <Icon src="header-arrow.svg" className="w-17 h-17" />
          </button>
      </div>
      {isPageNameVisible && (
        <span className="header__text  text-black">{pageName}</span>
      )}
      {isExchange && (
        <div className="flex items-center gap-5 [&_*]:transition-all [&_*]:duration-500">
          <ProgressBar currentStep={currentStep ?? 0} isBackward={isBackward} />
        </div>
      )}
      {isExchangeResult && (
        <button
          ref={backButton}
          onClick={onBackButtonClick}
          className="flex items-center justify-center relative w-16 h-16"
        >
          <Icon
            src="close.svg"
            className={clsx("w-12 h-12 transition-all duration-500 center")}
          />
        </button>
      )}
      {/* Right side: menu */}
      {!isExchangeResult && (
        <div className="flex justify-end relative">
          <button
            onClick={handleMenuToggle}
            ref={menuButtonRef}
            className="flex items-center justify-center"
          >
            <Icon
              src="menu.svg"
              className={clsx("w-16 h-16 transition-all duration-500 ", {
                "opacity-0": menuOpen,
                "opacity-100": !menuOpen,
              })}
            />
            <Icon
              src="close.svg"
              className={clsx("w-12 h-12 transition-all duration-500 center", {
                "opacity-100": menuOpen,
                "opacity-0": !menuOpen,
              })}
            />
          </button>
          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 top-[120%] z-50 min-w-180 bg-[#FFFFFF] rounded-10 shadow-lg border border-[#E9E9E9]  flex flex-col animate-fade-in rounded-6 text-black"
            >
              <button
                className="flex items-center gap-8 px-11 py-13  rounded-6"
                onClick={handleMakeQuestion}
              >
                <Icon src="support.svg" className="w-13 h-13" />
                <span className="text-13 leading-normal">Задать вопрос</span>
              </button>
              <div className="border-b border-[#E9E9E9]"></div>
              <button
                className="flex items-center gap-6 px-11 py-13  rounded"
                onClick={() => window.location.reload()}
              >
                <Icon src="reload.svg" className="w-15 h-15" />
                <span className="text-13 leading-normal">
                  Обновить страницу
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
