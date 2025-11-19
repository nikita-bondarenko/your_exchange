import { RATE_INTERVAL_KEY } from "@/shared/config";
import { clearMyInterval } from "../../model/interval";
import { useAppDispatch, useAppSelector } from "@/shared/model/store";
import {
  ExchangeTypeButton,
  setSelectedCurrencyBuyType,
} from "../../model";
import { filterReceiveVariants } from "../store/filterReceiveVariants";
import { useEffect, useState } from "react";

export const useSetSelectedCurrencySellTypeEffect = () => {
  const [receiveTypesVariants, setReceiveTypesVariants] = useState<ExchangeTypeButton[]>([]);

  const selectedCurrencySellType = useAppSelector(
    (state) => state.exchange.selectedCurrencySellType
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (selectedCurrencySellType) {
      //     console.log('before clearMyInterval')

      // clearMyInterval(RATE_INTERVAL_KEY);
      const receiveVariants = filterReceiveVariants(selectedCurrencySellType);
      setReceiveTypesVariants(receiveVariants)
      if (receiveVariants.length)
        dispatch(setSelectedCurrencyBuyType(receiveVariants[0].type));
    }
  }, [selectedCurrencySellType]);

  return {
    receiveTypesVariants,
  };
};
