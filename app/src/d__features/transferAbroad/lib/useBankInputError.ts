import { validateBank } from "@/shared/lib";
import {
  useAppSelector,
  useAppDispatch,
  setCountryInputError,
} from "@/shared/model/store";
import { useEffect } from "react";

export const useBankInputError = () => {
  const bank = useAppSelector((state) => state.transferAbroad.bank);

  const bankInputError = useAppSelector(
    (state) => state.transferAbroad.bankInputError
  );

  const dispatch = useAppDispatch();

  const areErrorsVisible = useAppSelector(
    (state) => state.transferAbroad.areTransferAbroadErrorsVisible
  );

  useEffect(() => {
    const error = validateBank({ value: bank?.name || null });

    dispatch(setCountryInputError(error));
  }, [bank]);

  return { bankInputError: areErrorsVisible ? bankInputError : null };
};
