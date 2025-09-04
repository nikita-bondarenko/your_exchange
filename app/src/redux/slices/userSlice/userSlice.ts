import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserListApiResponse } from "../../api/types";
import { number } from "zod";

export type UserState = {
  id: number | null;
  data: UserListApiResponse | null;
  mailRequired: boolean;
};

const initialState: UserState = {
  data: null,
  id: null,
  mailRequired: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId(state, action: PayloadAction<number>) {
      state.id = action.payload;
    },
    setUserData(state, action: PayloadAction<UserListApiResponse>) {
      state.data = action.payload;
    },

    setUserEmail(state, action: PayloadAction<string>) {
      if (state.data)
        if (state.data.user_data) state.data.user_data.email = action.payload;
    },
    setMailRequired(state, action: PayloadAction<boolean>) {
      state.mailRequired = action.payload;
    },
  },
});
export const { setUserId, setUserData, setUserEmail, setMailRequired } = userSlice.actions;
export default userSlice.reducer;
