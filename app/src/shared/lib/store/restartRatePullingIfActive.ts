import {  RootState } from "@/shared/model/store";
import { clearMyInterval } from ".";
import { RATE_INTERVAL_KEY } from "@/shared/config";
import { AppDispatch } from "@/shared/model/store/appDispatch";
import { setIsRateBeingPulled } from "@/d__features/exchange/model/store";

export const restartRatePullingIfActive = (
  listenerApi: any,
  dispatch: AppDispatch,
  intervalKey: string
) => {
  const state = listenerApi.getState() as RootState;
  if (state.exchange.isRateBeingPulled) {
    clearMyInterval(RATE_INTERVAL_KEY)
    setTimeout(() => {
      dispatch(setIsRateBeingPulled(true));
    }, 100); // Small delay to ensure state is updated
  }
};

