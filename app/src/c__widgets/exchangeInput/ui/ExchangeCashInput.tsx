import { setSelectedCityValue } from "@/d__features/exchange/model";
import { CurrencyInput } from "@/entities/currency/ui";
import { useExchangeInput, usePlaceholder } from "@/shared/lib";
import { Currency } from "@/shared/model/api";
import {
  useAppDispatch,
  useAppSelector,
  selectSectionHeadingProps,
  selectCurrencyOptions,
  selectCityOptions,
  selectCityValue,
  selectCityError,
} from "@/shared/model/store";
import { SectionHeading } from "@/shared/ui";
import { memo, useEffect } from "react";
import { MinValueNote } from "./MinValueNote";
import { ExchangeCurrencyPosition } from "@/shared/model/exchange";
import { PlaceSelect } from "@/entities/place/ui";
import { useTrackUserAction } from "@/d__features/userDataDisplay/lib";

export type ExchangeCashInputProps = {
  position: ExchangeCurrencyPosition;
};

const ExchangeCashInput: React.FC<ExchangeCashInputProps> = memo(
  ({ position }) => {
    const dispatch = useAppDispatch();
    const {
      selectedCurrency,
      isInitialLoad,
      setIsInitialLoad,
      globalStateValue,
      valueError,
      areErrorsVisible,
      onSelectChange,
      onInputChange,
    } = useExchangeInput(position);

    const sectionHeadingProps = useAppSelector(
      selectSectionHeadingProps(position)
    );

    const currencyOptions = useAppSelector(selectCurrencyOptions(position));
    const cityOptions = useAppSelector(selectCityOptions);
    const cities = useAppSelector((state) => state.exchange.cities);
    const cityValue = useAppSelector(selectCityValue);

    const cityError = useAppSelector(selectCityError);

    const placeholder = usePlaceholder(position, "CASH");

    useEffect(() => {
      if (isInitialLoad) {
        setIsInitialLoad(false);
        return;
      }
    }, []);

      const { trackInputChange } = useTrackUserAction();
    

    const onSelectCity = (cityName: string | null) => {
      if (isInitialLoad) return;
      const city = cities?.find((city) => city.name === cityName) || null;
      dispatch(setSelectedCityValue(city));
      if (cityName)
      trackInputChange(`Город`, cityName)
    };

    return (
      <div className="flex flex-col">
        <div>
          <SectionHeading
            note={<MinValueNote />}
            {...sectionHeadingProps}
            error={!!valueError && areErrorsVisible}
          />
          <CurrencyInput
            position={position}
            placeholder={placeholder}
            inputValue={globalStateValue}
            onInputChange={onInputChange}
            onSelectChange={onSelectChange}
            selectValue={selectedCurrency as Currency}
            options={currencyOptions || []}
            error={!!valueError && areErrorsVisible}
          />
        </div>

        <PlaceSelect
          value={cityValue.value?.name || ""}
          options={cityOptions || []}
          onChange={onSelectCity}
          placeholder="Выберите город получения"
          placeholderFocused="Введите название города"
          error={cityError && areErrorsVisible ? cityError : null}
        />
      </div>
    );
  }
);

ExchangeCashInput.displayName = "ExchangeCashInput";

export default ExchangeCashInput;
