"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@/shared/model/store";
import { BACK_BUTTON_ROUTES } from "@/shared/config";
import { Menu } from "./Menu";
import { CrossIcon, HeaderArrowIcon } from "@/shared/ui";
import { ProgressBar } from "@/c__widgets/progressBar/ui";
import { useTrackUserAction } from "@/d__features/userDataDisplay/lib";

export function Header() {
  const pathname = usePathname();
  const pageName = useAppSelector((state) => state.ui.pageName);
  const isHome = useMemo(() => pathname === "/", [pathname]);
  const isTransferAbroadDetails = useMemo(
    () => pathname === "/transfer-abroad/details",
    [pathname]
  );

  const isProgressBarActive = useMemo(
    () =>
      pathname?.startsWith("/exchange") ||
      pathname?.startsWith("/transfer-abroad"),
    [pathname]
  );

  const isResultPage = useMemo(() => pathname?.endsWith("/result"), [pathname]);
  const router = useRouter();

  const backButton = useRef<HTMLButtonElement>(null);
  const [isBackward, setIsBackward] = useState(false);
  const isAppReady = useAppSelector((state) => state.ui.isAppReady);

  useEffect(() => {
    setTimeout(() => {
      setIsBackward(false);
    }, 200);
  }, [pathname]);

  const { trackPushButton } = useTrackUserAction();

  const onBackButtonClick = () => {
    if (!isAppReady) return;
    const backButtonPath = BACK_BUTTON_ROUTES[pathname as string];
    if (isHome) {
      window.Telegram?.WebApp.close();
    } else if (isTransferAbroadDetails) {
      setIsBackward(true);
      router.back();
    } else {
      setIsBackward(true);
      router.push(backButtonPath);
    }
    trackPushButton("Назад");
  };

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
            "opacity-0 pointer-events-none": isResultPage,
          })}
        >
          <HeaderArrowIcon color="var(--text-main)" className="w-17 h-17" />
        </button>
      </div>
      {isPageNameVisible && (
        <span className="header__text  text-[var(--text-main)]">
          {pageName}
        </span>
      )}
      {isProgressBarActive && (
        <div className="flex items-center gap-5 [&_*]:transition-all [&_*]:duration-500">
          <ProgressBar isBackward={isBackward} />
        </div>
      )}
      {isResultPage && (
        <button
          data-tracking-label="Закрыть"
          ref={backButton}
          onClick={onBackButtonClick}
          className="flex items-center justify-center relative w-16 h-16"
        >
          <CrossIcon
            color="var(--text-main)"
            className="w-12 h-12 transition-all duration-500 center"
          ></CrossIcon>
        </button>
      )}
      {!isResultPage && <Menu />}
    </div>
  );
}
