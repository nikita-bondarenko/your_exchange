import { useServerAction } from "@/shared/lib";
import { useAppSelector } from "@/shared/model/store";
import {  useEffect } from "react";
import { writeSessionDetailsAction } from "../api";

export const useTrackUserAction = () => {
  const trackingSessionId = useAppSelector((state) => state.user.sessionId);
  const [writeSessionDetails, response] = useServerAction({
    action: writeSessionDetailsAction,
  });
  useEffect(() => {console.log(response)}, [response])
  const trackUserAction = (actionDescription: string) => {
    console.log(actionDescription, trackingSessionId);
    if (trackingSessionId)
      writeSessionDetails({
        session_id: trackingSessionId,
        action: actionDescription,
      });
  };
  return { trackUserAction };
};
