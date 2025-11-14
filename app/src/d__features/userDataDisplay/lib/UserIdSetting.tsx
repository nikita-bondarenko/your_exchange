"use client";
import {
  setIsAppReady,
  useAppDispatch,
  useAppSelector,
} from "@/shared/model/store";
import { TEST_USER_ID } from "@/shared/config";
import { setUserData, setUserId } from "@/d__features/userDataDisplay/model";
import { getUserDataAction } from "../api/actions/getUserDataAction";
import Script from "next/script";
import { useEffect, useLayoutEffect } from "react";

export function UserIdSetting() {
  const userId = useAppSelector((state) => state.user.id);

  const dispatch = useAppDispatch();
  const handleScriptLoad = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();

      let userId: number | null = null;

      if (process.env.NODE_ENV === "development") {
        userId = TEST_USER_ID;
      } else {
        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
          userId = window.Telegram.WebApp.initDataUnsafe.user.id;
        } else {
          console.error("user Id not found");
        }
      }
      // console.log(userId);
      if (userId) {
        setTimeout(() => {
          dispatch(setUserId(userId));
        }, 100);
      }
    }
  };

  useLayoutEffect(() => {
    // console.log(userId);
    if (userId)
      getUserDataAction({ userId })
        .then((result) => {
          // console.log(result);
          if (result) {
            dispatch(setUserData(result));
            dispatch(setIsAppReady(true));
          }
        })
        .catch(console.error);
  }, [userId]);

  return (
    <Script
      src="https://telegram.org/js/telegram-web-app.js"
      strategy="afterInteractive"
      onLoad={handleScriptLoad}
    />
  );
}
