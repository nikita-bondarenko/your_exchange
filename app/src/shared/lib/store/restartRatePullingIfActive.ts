import { AppDispatch, RootState, setIsRateBeingPulled } from "@/shared/model/store";

export const restartRatePullingIfActive = (
  listenerApi: any,
  dispatch: AppDispatch,
  intervalKey: string
) => {
  const state = listenerApi.getState() as RootState;
  if (state.exchange.isRateBeingPulled) {
    setTimeout(() => {
      dispatch(setIsRateBeingPulled(true));
    }, 100); // Small delay to ensure state is updated
  }
};

