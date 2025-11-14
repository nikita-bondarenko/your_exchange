"use client";
import { startTransition, useActionState, useEffect } from "react";
import { setIsAppReady, useAppDispatch } from "@/shared/model/store";
import { TEST_USER_ID } from "@/shared/config";
import { setUserData, setUserId } from "@/d__features/userDataDisplay/model";
import { getUserDataAction } from "../api/actions/getUserDataAction";

export function UserIdSetting() {
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

        let userId: number | null = null;
        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
          userId = window.Telegram.WebApp.initDataUnsafe.user.id;
        }
        if (process.env.NODE_ENV === "development") {
          userId = TEST_USER_ID;
        }
        if (userId) {
          fetch(`/api/auth/set-protection`).then(() => {
            dispatch(setUserId(userId));
            startTransition(() => {
              getUserDataAction({ userId })
                .then((result) => {
                  if (result) dispatch(setUserData(result));
                })
                .catch(console.error);
            });
          });
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
