"use client";
import { useEffect } from "react";
import { setIsAppReady, setUserId, useAppDispatch } from "@/shared/model/store";
import { TEST_USER_ID } from "@/shared/config";

export function TelegramWebAppInitializer() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;
    script.onload = () => {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        dispatch(setIsAppReady(true));

        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
          dispatch(setUserId(window.Telegram.WebApp.initDataUnsafe.user.id));
        }

        if (process.env.NODE_ENV === "development") {
          dispatch(setUserId(TEST_USER_ID));
        }
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return <></>;
}
