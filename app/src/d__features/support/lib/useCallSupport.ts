import { useAppSelector } from "@/shared/model/store/hooks";
import { callOperatorAction } from "../api";
import { startTransition } from "react";

export const useCallSupport = () => {
  const userId = useAppSelector((state) => state.user.id);
  const isAppReady = useAppSelector((state) => state.ui.isAppReady);

  const callSupport = async () => {
    if (!isAppReady) return;
    if (!userId) {
      console.error("User ID is required");
      return;
    }

    try {
      startTransition(async () => {
        await callOperatorAction({
          body: {
            user_id: userId,
          },
        });

        // Пробуем закрыть WebApp после успешного запроса
        if (
          window.Telegram &&
          window.Telegram.WebApp &&
          typeof window.Telegram.WebApp.close === "function"
        ) {
          window.Telegram.WebApp.close();
        } else {
          alert("Вы можете закрыть это окно вручную");
        }
      });
    } catch (error) {
      console.error("Error calling support:", error);
    }
  };

  return {
    callSupport,
  };
};
