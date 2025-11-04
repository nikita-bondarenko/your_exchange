import { CurrencySubOption, useGetTransferDetailsMutation } from "@/shared/api";
import { setPlatform, useAppSelector } from "@/shared/model/store";
import { useState, useEffect } from "react";

export const useTransferDetailsOptions = () => {
  const [countries, setCountries] = useState<CurrencySubOption[]>([]);
  const [platforms, setPlatforms] = useState<CurrencySubOption[]>([]);
  const [banks, setBanks] = useState<CurrencySubOption[]>([]);

  const transferTypeId = useAppSelector(
    (state) => state.transferAbroad.selectedTranserTypeOptionId
  );
  const currency = useAppSelector((state) => state.transferAbroad.currency);

  useEffect(() => {
    if (currency && transferTypeId) {
      getTransferDetails({
        currency_id: currency.id,
        transfer_option_id: transferTypeId,
      }).then((res) => {
        if (res?.data?.countries) {
          setCountries(res?.data?.countries);
        }
        if (res?.data?.banks) {
          setBanks(res?.data?.banks);
        }
        if (res?.data?.platforms) {
          setPlatforms(res?.data?.platforms);
        }
      });
    }
  }, [currency, transferTypeId]);

  const [getTransferDetails] = useGetTransferDetailsMutation();

  return {
    countries,
    banks,
    platforms,
  };
};
