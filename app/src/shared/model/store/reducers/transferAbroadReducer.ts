import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrencySubOption, TransferAbroadCurrency } from "@/shared/api";

type TransferAbroadState = {
  transferType: "individual" | "legal_entity";
  selectedTranserTypeOptionId: number | null;
  amount: number | null;
  currency: TransferAbroadCurrency | null;
  isNextPageAvailable: boolean;
  taskDescription: string | null;
  abroadCompanyRequisites: string;
  russianCompanyRequisites: string;
  file1: File | null;
  file2: File | null;
  file1PreviewUrl: string | null;
  file2PreviewUrl: string | null;
  countryName: string;
  platform: CurrencySubOption | null;
  bank: CurrencySubOption | null;
  cardNumber: string;
  currencyAmountInputError: string | null;
  taskInputError: string | null;
  countryInputError: string | null;
  bankInputError: string | null;
  cardNumberInputError: string | null;
  maxCurrencyAmount: number | null;
  areTransferAbroadErrorsVisible: boolean
};

const initialState: TransferAbroadState = {
  transferType: "individual",
  selectedTranserTypeOptionId: null,
  amount: null,
  currency: null,
  isNextPageAvailable: false,
  taskDescription: null,
  abroadCompanyRequisites: "",
  russianCompanyRequisites: "",
  file1: null,
  file2: null,
  file1PreviewUrl: null,
  file2PreviewUrl: null,
  countryName: "",
  platform: null,
  bank: null,
  cardNumber: "",
  currencyAmountInputError: null,
  taskInputError: null,
  countryInputError: null,
  bankInputError: null,
  cardNumberInputError: null,
  maxCurrencyAmount: null,
  areTransferAbroadErrorsVisible: false
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
    setTransferAbroadCurrencyAmount: (
      state,
      action: PayloadAction<number | null>
    ) => {
      state.amount = action.payload;
    },
    setTransferAbroadCurrency: (
      state,
      action: PayloadAction<TransferAbroadCurrency>
    ) => {
      state.currency = action.payload;
    },
    setIsNextPageAvailable: (state, action: PayloadAction<boolean>) => {
      state.isNextPageAvailable = action.payload;
    },
    setTaskDescription: (state, action: PayloadAction<string | null>) => {
      state.taskDescription = action.payload;
    },
    setAbroadCompanyRequisites: (state, action: PayloadAction<string>) => {
      state.abroadCompanyRequisites = action.payload;
    },
    setRussianCompanyRequisites: (state, action: PayloadAction<string>) => {
      state.russianCompanyRequisites = action.payload;
    },
    setFile1: (state, action: PayloadAction<File | null>) => {
      state.file1 = action.payload;
    },
    setFile2: (state, action: PayloadAction<File | null>) => {
      state.file2 = action.payload;
    },
    setFile1PreviewUrl: (state, action: PayloadAction<string | null>) => {
      state.file1PreviewUrl = action.payload;
    },
    setFile2PreviewUrl: (state, action: PayloadAction<string | null>) => {
      state.file2PreviewUrl = action.payload;
    },
    setCountryName: (state, action: PayloadAction<string>) => {
      state.countryName = action.payload;
    },
    setPlatform: (state, action: PayloadAction<CurrencySubOption>) => {
      state.platform = action.payload;
    },
    setBank: (state, action: PayloadAction<CurrencySubOption>) => {
      state.bank = action.payload;
    },
    setCardNumber: (state, action: PayloadAction<string>) => {
      state.cardNumber = action.payload;
    },
    setCardNumberInputError: (state, action: PayloadAction<string | null>) => {
      state.cardNumberInputError = action.payload;
    },
    setCurrencyAmountInputError: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.currencyAmountInputError = action.payload;
    },
    setTaskInputError: (state, action: PayloadAction<string | null>) => {
      state.taskInputError = action.payload;
    },
    setCountryInputError: (state, action: PayloadAction<string | null>) => {
      state.countryInputError = action.payload;
    },
    setBankInputError: (state, action: PayloadAction<string | null>) => {
      state.bankInputError = action.payload;
    },
    setMaxCurrencyAmount: (state, action: PayloadAction<number | null>) => {
      state.maxCurrencyAmount = action.payload;
    },
    setTransferAbroadAreErrorsVisible:(state, action: PayloadAction<boolean>) => {
      state.areTransferAbroadErrorsVisible = action.payload
    }
  },
});

export const {
  setIsNextPageAvailable,
  setSelectedTranserTypeOptionId,
  setTransferType,
  setTransferAbroadCurrencyAmount,
  setTransferAbroadCurrency,
  setTaskDescription,
  setAbroadCompanyRequisites,
  setFile1,
  setFile2,
  setRussianCompanyRequisites,
  setFile1PreviewUrl,
  setFile2PreviewUrl,
  setCountryName,
  setPlatform,
  setBank,
  setCardNumber,
  setCardNumberInputError,
  setCurrencyAmountInputError,
  setTaskInputError,
  setCountryInputError,
  setBankInputError,
  setMaxCurrencyAmount,
  setTransferAbroadAreErrorsVisible
} = transferAbroadSlice.actions;
export const transferAbroadReducer = transferAbroadSlice.reducer;
