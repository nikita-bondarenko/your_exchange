// src/lib/features/uiSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthSlice = {
  token: string | null
}

const initialState: AuthSlice = { token: null };

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
  },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
