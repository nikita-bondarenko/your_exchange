import {
  useAppSelector,
  useAppDispatch,
} from "@/shared/model/store";
import { useEffect } from "react";
import { setCountryInputError } from "../model";

export const useCountryInputError = () => {
  const countryName = useAppSelector(
    (state) => state.transferAbroad.countryName
  );

  const countryInputError = useAppSelector(
    (state) => state.transferAbroad.countryInputError
  );

  const dispatch = useAppDispatch();

  const areErrorsVisible = useAppSelector(
    (state) => state.transferAbroad.areTransferAbroadErrorsVisible
  );

  useEffect(() => {
    let error = null;

    if (countryName.trim().length === 0) {
      error = "Выберите страну";
    }

    dispatch(setCountryInputError(error));
  }, [countryName]);

  return { countryInputError: areErrorsVisible ? countryInputError : null };
};
