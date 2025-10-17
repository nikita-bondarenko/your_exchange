import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PageData } from "../../project";
import { PROJECT_DATA } from "@/shared/config";

export type PageDataState = PageData

const initialState: PageDataState = PROJECT_DATA.page;

export const pageDataSlice = createSlice({
  name: "pageData",
  initialState,
  reducers: {
   setPageData(state, action: PayloadAction<PageData>) {
    const pageData = action.payload
    state.home = pageData.home
    state.result = pageData.result
   }
  },
});

export const { setPageData } = pageDataSlice.actions;
export const pageDataReducer = pageDataSlice.reducer;
