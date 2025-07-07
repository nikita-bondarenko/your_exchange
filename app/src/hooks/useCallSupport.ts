import { useAppSelector } from "@/redux/hooks";

import { usePostCallingOperatorMutation } from "@/redux/api/cryptusApi";

export const useCallSupport = () => {
  const [callOperator] = usePostCallingOperatorMutation();
  const userId = useAppSelector((state) => state.user.id);
  const isAppReady = useAppSelector((state) => state.ui.isAppReady);
  
  const callSupport = async () => {
    if (!isAppReady) return;
    if (!userId) {
      console.error("User ID is required");
      return;
    }
  
    try {
      await callOperator({
        body: {
          user_id: userId,
        }
      }).unwrap();
  
      // Пробуем закрыть WebApp после успешного запроса
      if (window.Telegram && window.Telegram.WebApp && typeof window.Telegram.WebApp.close === "function") {
        window.Telegram.WebApp.close();
      } else {
        alert("Вы можете закрыть это окно вручную");
      }
    } catch (error) {
      console.error("Error calling support:", error);
    }
  };

  return {
    callSupport,
  };
}; 