import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Bank, DirectionType, Request } from "../api/types";

export type RequestDetails = Request


type RequestDetailsState = {
    data: RequestDetails | null;
};

export const requestDetailsSlice = createSlice({
  name: "requestDetails",
  initialState: { data: null } as RequestDetailsState,
  reducers: {
    setRequestDetails: (state, action: PayloadAction<RequestDetails>) => {
            state.data = action.payload;
     
    },
  },
});

export const { setRequestDetails } = requestDetailsSlice.actions;
export default requestDetailsSlice.reducer;