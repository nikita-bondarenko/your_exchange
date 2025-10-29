import { string } from "zod";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TransferAbroadState = {
  transferType: "individual" | "legal_entity";
  selectedTranserTypeOptionId: number | null;
  amount: number;
  currencyName: string | null;
  isNextPageAvailable: boolean;
  taskDescription: string | null;
};

const initialState: TransferAbroadState = {
  transferType: "individual",
  selectedTranserTypeOptionId: null,
  amount: 1000,
  currencyName: null,
  isNextPageAvailable: false,
  taskDescription: null,
};

export const transferAbroadSlice = createSlice({
  name: "transferAbroad",
  initialState,
  reducers: {
    setSelectedTranserTypeOptionId: (state, action: PayloadAction<number>) => {
      state.selectedTranserTypeOptionId = action.payload;
    },
    setTransferType: (state, action: PayloadAction<string>) => {
      if (
        action.payload !== "individual" &&
        action.payload !== "legal_entity"
      ) {
        console.error("transfer type is not correct");
        return;
      }
      state.transferType = action.payload;
    },
    setTransferAbroadCurrencyAmount: (state, action: PayloadAction<number>) => {
      state.amount = action.payload;
    },
    setTransferAbroadCurrencyName: (state, action: PayloadAction<string>) => {
      state.currencyName = action.payload;
    },
    setIsNextPageAvailable: (state, action: PayloadAction<boolean>) => {
      state.isNextPageAvailable = action.payload;
    },
    setTaskDescription: (state, action: PayloadAction<string | null>) => {
      state.taskDescription = action.payload;
    },
  },
});

export const {
  setIsNextPageAvailable,
  setSelectedTranserTypeOptionId,
  setTransferType,
  setTransferAbroadCurrencyAmount,
  setTransferAbroadCurrencyName,
  setTaskDescription
} = transferAbroadSlice.actions;
export const transferAbroadReducer = transferAbroadSlice.reducer;
