"use client";
import { startTransition, useEffect, useState } from "react";
import { setIsAppReady, useAppDispatch } from "@/shared/model/store";
import { setUserId, setUserData } from "@/d__features/userDataDisplay/model";
import { getUserDataAction } from "../api/actions/getUserDataAction";
import { TEST_USER_ID } from "@/shared/config";

export function UserIdSetting() {
  const dispatch = useAppDispatch();
  const [scriptLoaded, setScriptLoaded] = useState(false);
    const [protectionEnabled, setProtectionEnabled] = useState(false);


  useEffect(() => {
    // Если скрипт уже есть — просто отмечаем
    if (window.Telegram?.WebApp) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;

    script.onload = () => {
      setScriptLoaded(true);
    };

    script.onerror = () => {
      console.error("Failed to load Telegram WebApp script");
    };

    document.head.appendChild(script);

    fetch('/api/auth/set-protection').then(() => {
      setProtectionEnabled(true)
    })

    return () => {
      // Не удаляем скрипт при размонтировании — он нужен глобально
      // document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !protectionEnabled) return;
    dispatch(setIsAppReady(true));

    const tg = window.Telegram?.WebApp;
    if (!tg) {
      console.warn("Telegram WebApp not available");
      return;
    }

    // Важно: сначала вызываем ready(), потом expand()
    tg.ready();
    tg.expand();


    // Даем Telegram время подгрузить initData
    const initWithDelay = () => {
      setTimeout(() => {
        let userId: number | null = TEST_USER_ID;

        // ВАЖНО: в продакшене initDataUnsafe может быть пустым сразу после ready()
        // Нужно ждать события onEvent('viewportChanged') или просто retry
        if (tg.initDataUnsafe?.user?.id) {
          userId = tg.initDataUnsafe.user.id;
        }

        // Dev-режим
        if (process.env.NODE_ENV === "development" && !userId) {
          userId = TEST_USER_ID;
        }

        if (userId) {
          handleUserId(userId);
        } else {
          console.warn("Telegram user ID not found, retrying...");
          // Retry через 300мс, максимум 10 раз
          let attempts = 0;
          const interval = setInterval(() => {
            if (tg.initDataUnsafe?.user?.id) {
              clearInterval(interval);
              handleUserId(tg.initDataUnsafe.user.id);
            }
            attempts++;
            if (attempts > 10) {
              clearInterval(interval);
              console.error("Failed to get Telegram user ID after retries");
            }
          }, 300);
        }
      }, 100);
    };

    const handleUserId = (id: number) => {
      dispatch(setUserId(id));

      // Защита от ботов + авторизация через initData
   
          startTransition(() => {
            getUserDataAction({ userId: id })
              .then((result) => {
                if (result) dispatch(setUserData(result));
              })
              .catch((err) => {
                console.error("Failed to fetch user data:", err);
              });
          });
    };

    initWithDelay();

    tg.onEvent?.("viewportChanged", initWithDelay);
    tg.onEvent?.("themeChanged", initWithDelay);

    return () => {
      tg.offEvent?.("viewportChanged", initWithDelay);
      tg.offEvent?.("themeChanged", initWithDelay);
    };
  }, [scriptLoaded, dispatch, protectionEnabled]);

  return <></>;
}