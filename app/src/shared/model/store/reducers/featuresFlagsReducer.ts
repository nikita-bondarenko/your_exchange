import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeaturesFlagsReducerState } from "../state";



const initialState: FeaturesFlagsReducerState = {
  isExchangeMode: true,
  isTransferAbroadMode: false,
};

export const featuresFlagsSlice = createSlice({
  name: "featuresFlags",
  initialState,
  reducers: {
    setIsExchangeMode: (state, action: PayloadAction<boolean>) => {
      const isExchangeMode = action.payload
      state.isExchangeMode = isExchangeMode;
      state.isTransferAbroadMode = !isExchangeMode;
    },
  },
});

export const {setIsExchangeMode} = featuresFlagsSlice.actions;
export const featuresFlagsReducer = featuresFlagsSlice.reducer;
