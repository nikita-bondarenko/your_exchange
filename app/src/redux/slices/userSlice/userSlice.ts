import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserListApiResponse, UserUpdateCreateApiArg } from "../../api/types";
import { number } from "zod";

export type UserState = {
  id: number | null;
  data: UserListApiResponse | null;
  mailRequired: boolean;
  agreementAccepted: boolean;
};

const initialState: UserState = {
  data: null,
  id: null,
  mailRequired: false,
  agreementAccepted: true,
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
    setAgreementAccepted(state, action: PayloadAction<boolean>) {
      state.agreementAccepted = action.payload;
    },
    updateUserProfileData(
      state,
      action: PayloadAction<UserUpdateCreateApiArg>
    ) {
      const {
       full_name, phone, email ,
      } = action.payload;
      if (state.data?.user_data) {
        state.data.user_data.email = email;
        state.data.user_data.name = full_name;
        state.data.user_data.phone = phone;
      }
    },
  },
});
export const {
  setUserId,
  setUserData,
  setUserEmail,
  setMailRequired,
  setAgreementAccepted,
  updateUserProfileData
} = userSlice.actions;
export default userSlice.reducer;
