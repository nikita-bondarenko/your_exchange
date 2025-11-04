import {
  setAbroadCompanyRequisites,
  setBank,
  setCardNumber,
  setCountryName,
  setFile1,
  setFile1PreviewUrl,
  setFile2,
  setFile2PreviewUrl,
  setMaxCurrencyAmount,
  setPlatform,
  setRussianCompanyRequisites,
  setTaskDescription,
  setTransferAbroadAreErrorsVisible,
  setTransferAbroadCurrency,
  setTransferAbroadCurrencyAmount,
  useAppDispatch,
} from "@/shared/model/store";
import { useEffect } from "react";

export const useNullifyTransferAbroadInputs = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setTransferAbroadAreErrorsVisible(false));
    dispatch(setMaxCurrencyAmount(null));
    dispatch(setAbroadCompanyRequisites(""));
    dispatch(setRussianCompanyRequisites(""));
    dispatch(setFile1(null));
    dispatch(setFile1PreviewUrl(null));
    dispatch(setFile2(null));
    dispatch(setFile2PreviewUrl(null));
    dispatch(setTaskDescription(null));
    dispatch(setTransferAbroadCurrencyAmount(null));
    dispatch(setCountryName(''))
    dispatch(setBank(null))
    dispatch(setCardNumber(''))
    dispatch(setPlatform(null))
  }, []);
};
