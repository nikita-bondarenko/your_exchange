import { validateCardNumber } from "@/shared/lib";
import {
  useAppSelector,
  useAppDispatch,
  setCountryInputError,
  setCardNumberInputError,
} from "@/shared/model/store";
import { useEffect } from "react";

export const useCardNumberInputError = () => {
  const cardNumber = useAppSelector((state) => state.transferAbroad.cardNumber);

  const cardNumberInputError = useAppSelector(
    (state) => state.transferAbroad.cardNumberInputError
  );

  const areErrorsVisible = useAppSelector(
    (state) => state.transferAbroad.areTransferAbroadErrorsVisible
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    const error = validateCardNumber({ value: cardNumber });
    dispatch(setCardNumberInputError(error));
  }, [cardNumber]);

  return { cardNumberInputError: areErrorsVisible ? cardNumberInputError : null };
};
