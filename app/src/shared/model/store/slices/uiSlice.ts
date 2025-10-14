// src/lib/features/uiSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type uiState = {
  pageName: string | null;
  isLoading: boolean;
  exchangeId: number | null;
  isAppReady: boolean;
}

const initialState: uiState = { pageName: "", isLoading: true, exchangeId: null, isAppReady: false };

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setPageName(state, action: PayloadAction<string | null>) {
      state.pageName = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setExchangeId(state, action: PayloadAction<number | null | undefined>) {
      if (!action.payload) return
      state.exchangeId = action.payload;
    },
    setIsAppReady(state, action: PayloadAction<boolean>) {
      state.isAppReady = action.payload;
    },
  },
});

export const { setPageName, setIsLoading, setExchangeId, setIsAppReady } = uiSlice.actions;
export default uiSlice.reducer;
