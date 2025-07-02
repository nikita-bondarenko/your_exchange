import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserListApiResponse } from "../../api/types";
import { number } from "zod";

export type UserState = {
  id: number | null;
  data: UserListApiResponse | null;
}

const initialState: UserState = {
  data: null,
  id: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId(state, action: PayloadAction<number>) {
      state.id = action.payload;
    },
    setUserData (state, action: PayloadAction<UserListApiResponse>) {
      state.data = action.payload;
    },
  },
});
export const { setUserId, setUserData } = userSlice.actions;
export default userSlice.reducer;
