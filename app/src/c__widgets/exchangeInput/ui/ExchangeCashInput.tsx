import CitySelect from "@/entities/city/ui";
import { CurrencyInput } from "@/entities/currency/ui";
import { CurrencyPosition } from "@/entities/requestDetails/ui";
import { Currency } from "@/shared/api";
import { useExchangeInput } from "@/shared/lib/exchange";
import { usePlaceholder } from "@/shared/lib/exchange/usePlaceholder";
import { useAppDispatch, useAppSelector, selectSectionHeadingProps, selectCurrencyOptions, selectCityOptions, selectCityValue, selectCityError, setSelectedCityValue } from "@/shared/model/store";
import SectionHeading from "@/shared/ui/exchange/SectionHeading";
import React, { memo, useEffect, useState } from "react";



export type ExchangeCashInputProps = {
  position: CurrencyPosition;
};

const ExchangeCashInput: React.FC<ExchangeCashInputProps> = memo(({ position }) => {
  
  const dispatch = useAppDispatch();
  const {
    selectedCurrency,
    isInitialLoad,
    setIsInitialLoad,
    globalStateValue,
    valueError,
    areErrorsVisible,
    onSelectChange,
    onInputChange
  } = useExchangeInput(position);

  const sectionHeadingProps = useAppSelector(
    selectSectionHeadingProps(position)
  );

  const currencyOptions = useAppSelector(selectCurrencyOptions(position));
  const cityOptions = useAppSelector(selectCityOptions);
  const cities = useAppSelector(state => state.exchange.cities);
  const cityValue = useAppSelector(selectCityValue);
  
  const cityError = useAppSelector(selectCityError);

  const placeholder = usePlaceholder(position, "CASH");

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

  }, []);

  const onSelectCity = (cityName: string | null) => {
    if (isInitialLoad) return;
    const city = cities?.find(city => city.name === cityName) || null;
      dispatch(setSelectedCityValue(city));
  }

  return (
    <div className="flex flex-col">
      <div>
        <SectionHeading
          {...sectionHeadingProps}
          error={!!valueError && areErrorsVisible}
        />
        <CurrencyInput
          placeholder={placeholder}
          inputValue={globalStateValue}
          onInputChange={onInputChange}
          onSelectChange={onSelectChange}
          selectValue={selectedCurrency as Currency}
          options={currencyOptions || []}
          error={!!valueError && areErrorsVisible}
        />
      </div>

      <CitySelect
        value={cityValue.value?.name || ''}
        options={cityOptions || []}
        onChange={onSelectCity}
        placeholder="Выберите город получения"
        placeholderFocused="Введите название города"
        error={cityError && areErrorsVisible ? cityError : null}
      />
    </div>
  );
});

ExchangeCashInput.displayName = "ExchangeCashInput";

export default ExchangeCashInput;

