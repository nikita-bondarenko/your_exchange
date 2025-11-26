import { useAppSelector } from "@/shared/model/store/hooks";
import { callOperatorAction } from "../api";
import { useEffect } from "react";
import { useServerAction } from "@/shared/lib";
import { setCallOperatorLoading } from "../model/store";
import { useTrackUserAction } from "@/d__features/userDataDisplay/lib";

export const useCallSupport = () => {
  const userId = useAppSelector((state) => state.user.id);
  const isAppReady = useAppSelector((state) => state.ui.isAppReady);
  const { trackUserAction } = useTrackUserAction();

  const [callOperator, response] = useServerAction({
    action: callOperatorAction,
    loadingAction: setCallOperatorLoading,
  });

  const callSupport = async () => {
    if (!isAppReady) return;
    if (!userId) {
      console.error("User ID is required");
      return;
    }
    trackUserAction("Вызвана поддержка");
    callOperator({
      user_id: userId,
    });
  };

  useEffect(() => {
    if (response)
      if (
        window.Telegram &&
        window.Telegram.WebApp &&
        typeof window.Telegram.WebApp.close === "function"
      ) {
        window.Telegram.WebApp.close();
      } else {
        alert("Вы можете закрыть это окно вручную");
      }
  }, [response]);

  return {
    callSupport,
  };
};
