"use client";
import {
  setIsAppReady,
  useAppDispatch,
  useAppSelector,
} from "@/shared/model/store";
import { TEST_USER_ID } from "@/shared/config";
import {
  setGetUserDataLoading,
  setSessionId,
  setUserData,
  setUserId,
} from "@/d__features/userDataDisplay/model";
import { getUserDataAction } from "../../d__features/userDataDisplay/api/actions/getUserDataAction";
import Script from "next/script";
import { startTransition, useEffect } from "react";
import { useServerAction } from "@/shared/lib";
import { createTrackingSessionAction } from "@/d__features/userDataDisplay/api/actions/createTrackingSessionAction";

export function TelegramAppInitializer() {
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
      if (userId) {
        dispatch(setUserId(userId));
      }
    }
  };

  const [getUserData, userData] = useServerAction({
    action: getUserDataAction,
    loadingAction: setGetUserDataLoading,
  });

  const [createTrackingSession, createTrackingSessionResponse] =
    useServerAction({
      action: createTrackingSessionAction,
    });

  useEffect(() => {
    if (userId) {
      getUserData({ userId });
      createTrackingSession({ user_id: userId });
    }
  }, [userId]);

  useEffect(() => {
    if (userData) {
      dispatch(setUserData(userData));
      dispatch(setIsAppReady(true));
    }
  }, [userData]);

  useEffect(() => {
    if(createTrackingSessionResponse?.session_id) {
      dispatch(setSessionId(createTrackingSessionResponse.session_id))
    }
  }, [createTrackingSessionResponse])

  return (
    <Script      
      src="https://telegram.org/js/telegram-web-app.js"
      strategy="afterInteractive"
      onLoad={handleScriptLoad}
    />
  );
}
