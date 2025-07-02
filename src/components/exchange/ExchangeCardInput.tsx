import React, { memo, useCallback, useEffect, useState } from "react";
import { CurrencyPosition } from "../request/RequestDetails";
import CurrencyInput from "./CurrencyInput";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectSectionHeadingProps,
  selectCurrencyOptions,
  selectBankOptions,
  selectBankValue,
  selectCardNumberValue,
  selectBankError,
  selectCardNumberError,
  selectAreErrorsVisible,
} from "@/redux/selectors";

import { usePlaceholder } from "@/hooks/usePlaceholder";
import SectionHeading from "../ui/SectionHeading";
import { InputWrapper } from "../ui/InputWrapper";
import { Input } from "../ui/Input";
import BankSelect, { BankOption } from "./BankSelect";
import { formatWithSpacesCardNumber, normalizeInput } from "@/helpers/valueMask";
import { useExchangeInput } from "@/hooks/useExchangeInput";
import { setCardNumberValue, setSelectedBankValue } from "@/redux/slices/exchangeSlice/exchangeSlice";
import { Currency } from "@/redux/api/types";

export type ExchangeCardInputProps = {
  position: CurrencyPosition;
};

const ExchangeCardInput: React.FC<ExchangeCardInputProps> = memo(({ position }) => {
  
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
  const bankOptions = useAppSelector(selectBankOptions);
  const bankValue = useAppSelector(selectBankValue);
  const banks = useAppSelector(state => state.exchange.banks);
  const cardNumberValue = useAppSelector(selectCardNumberValue);
  const bankError = useAppSelector(selectBankError);
  const cardNumberError = useAppSelector(selectCardNumberError);

  const placeholder = usePlaceholder(position,"BANK");

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
    const isNumber = /^[0-9]$/.test(e.key);

    if (!isNumber && !allowed.includes(e.key)) {
      e.preventDefault();
    }
  }, []);

  const handleCardNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = normalizeInput(e.target.value);
    dispatch(setCardNumberValue(formatWithSpacesCardNumber(raw)));
  }, [dispatch]);

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

  }, []);

  const handleBankChange = (option: BankOption | null) => {
   
    if (!option) return;
    if (isInitialLoad) return;
    const bank = banks?.find(bank => bank.id === option.id);
    // console.log(option, bank)
    if (bank) {
      dispatch(setSelectedBankValue(bank));
    }
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

  { bankOptions.length > 0 &&    <BankSelect
        value={bankValue}
        options={bankOptions || []}
        onChange={handleBankChange}
        placeholder="Выберите банк получения"
        error={bankError && areErrorsVisible ? bankError : null}
      />}
      {position === "received" && (
        <div className="-mb-16">
          <InputWrapper error={cardNumberError && areErrorsVisible ? cardNumberError : null}>
            <Input
              onChange={handleCardNumberChange}
              onKeyDown={handleKeyDown}
              value={cardNumberValue ?? ""}
              type="text"
              className=" border border-[#FFFFFF] rounded-6 bg-[#FFFFFF] placeholder:text-[#BFBFBF] text-16 leading-normal px-18 py-15 w-full"
              placeholder="Номер карты"
            />
          </InputWrapper>
        </div>
      )}
    </div>
  );
});

ExchangeCardInput.displayName = "ExchangeCardInput";

export default ExchangeCardInput; 