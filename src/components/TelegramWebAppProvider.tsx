"use client";

import { useEffect } from "react";
import Script from "next/script";
import { setIsAppReady } from "@/redux/slices/uiSlice";
import { useAppDispatch } from "@/redux/hooks";

export function TelegramWebAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    script.onload = () => {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        dispatch(setIsAppReady(true));
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
 
    // dispatch(setIsAppReady(true))
  }, []);

  return (<>{children}</>);
}
