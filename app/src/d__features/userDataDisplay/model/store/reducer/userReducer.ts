import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserListApiResponse, UserUpdateCreateApiArg } from "@/shared/model/api";
import { UserReducerState } from "@/shared/model/store/state";

const initialState: UserReducerState = {
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
export const userReducer = userSlice.reducer;
