import { useAppSelector } from "@/shared/model/store";
import { useMemo } from "react";

export const useIsInvoiceFormValid = () => {
      const currencyAmountError = useAppSelector(
        (state) => state.transferAbroad.currencyAmountInputError
      );
    
      const countryInputError = useAppSelector(
        (state) => state.transferAbroad.countryInputError
      );
    
      const isFormValid = useMemo(
        () => !currencyAmountError && !countryInputError,
        [currencyAmountError, countryInputError]
      );
    
      return {
        isFormValid,
      };
}