import { PlaceSelect } from "@/entities/place/ui";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/model/store";
import { memo } from "react";
import { useTransferDetailsOptions } from "../lib/useTransferDetailsOptions";
import { useCountryInputError } from "../lib/useCountryInputError";
import { setCountryName } from "../model";
import { useTrackUserAction } from "@/d__features/userDataDisplay/lib";

export const TransferCountryInput = memo(() => {
  const dispatch = useAppDispatch();

  const { countries } = useTransferDetailsOptions();

  const countryName = useAppSelector(
    (state) => state.transferAbroad.countryName
  );

  const { countryInputError } = useCountryInputError();

  const {trackInputChange} = useTrackUserAction()

  const handleSelect = (value: string | null) => {
    if (value) {
      dispatch(setCountryName(value))
      trackInputChange('Страна', value)
    };
  };
  return (
    <div className="-mt-26">
      <PlaceSelect
        error={countryInputError}
        onChange={handleSelect}
        value={countryName}
        options={countries}
        placeholder="Введите название страны"
      ></PlaceSelect>
    </div>
  );
});
TransferCountryInput.displayName = "TransferCountryInput";
