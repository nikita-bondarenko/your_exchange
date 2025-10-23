import { BankSelect, BankOption } from "@/entities/bank/ui";
import { CurrencyInput } from "@/entities/currency/ui";
import { CurrencyPosition } from "@/entities/requestDetails/ui";
import { Currency } from "@/shared/api";
import {
  useExchangeInput,
  usePlaceholder,
  normalizeInput,
  formatWithSpacesCardNumber,
  formatPhoneNumber,
} from "@/shared/lib";
import {
  useAppDispatch,
  useAppSelector,
  selectSectionHeadingProps,
  selectCurrencyOptions,
  selectBankOptions,
  selectBankValue,
  selectCardNumberValue,
  selectPhoneNumberValue,
  selectIsPhoneNumberUsed,
  selectBankError,
  selectCardNumberError,
  selectPhoneNumberError,
  setCardNumberValue,
  setPhoneNumberValue,
  setSelectedBankValue,
} from "@/shared/model/store";
import { InputWrapper, Input } from "@/shared/ui";
import { SectionHeading } from "@/shared/ui/exchange/SectionHeading";
import React, { memo, useCallback, useEffect } from "react";
import { MinValueNote } from "./MinValueNote";

export type ExchangeCardInputProps = {
  position: CurrencyPosition;
};

const ExchangeCardInput: React.FC<ExchangeCardInputProps> = memo(
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
    const bankOptions = useAppSelector(selectBankOptions);
    const bankValue = useAppSelector(selectBankValue);
    const banks = useAppSelector((state) => state.exchange.banks);
    const cardNumberValue = useAppSelector(selectCardNumberValue);
    const phoneNumberValue = useAppSelector(selectPhoneNumberValue);
    const isPhoneNumberUsed = useAppSelector(selectIsPhoneNumberUsed);
    const bankError = useAppSelector(selectBankError);

    const cardNumberError = useAppSelector(selectCardNumberError);
    const phoneNumberError = useAppSelector(selectPhoneNumberError);

    const placeholder = usePlaceholder(position, "BANK");

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        const allowed = [
          "Backspace",
          "Delete",
          "ArrowLeft",
          "ArrowRight",
          "Tab",
        ];
        const isNumber = /^[0-9]$/.test(e.key);

        if (!isNumber && !allowed.includes(e.key)) {
          e.preventDefault();
        }
      },
      []
    );

    const handlePhoneKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        const allowed = [
          "Backspace",
          "Delete",
          "ArrowLeft",
          "ArrowRight",
          "Tab",
        ];
        const isNumber = /^[0-9]$/.test(e.key);

        if (!isNumber && !allowed.includes(e.key)) {
          e.preventDefault();
        }
      },
      []
    );

    const handleCardNumberChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = normalizeInput(e.target.value);
        dispatch(setCardNumberValue(formatWithSpacesCardNumber(raw)));
      },
      [dispatch]
    );

    const handlePhoneNumberChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedPhone = formatPhoneNumber(e.target.value);
        dispatch(setPhoneNumberValue(formattedPhone));
      },
      [dispatch]
    );

    useEffect(() => {
      if (isInitialLoad) {
        setIsInitialLoad(false);
        return;
      }
    }, []);

    const handleBankChange = (option: BankOption | null) => {
      if (!option) return;
      if (isInitialLoad) return;
      const bank = banks?.find((bank) => bank.id === option.id);
      if (bank) {
        dispatch(setSelectedBankValue(bank));
      }
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
            placeholder={placeholder}
            inputValue={globalStateValue}
            onInputChange={onInputChange}
            onSelectChange={onSelectChange}
            selectValue={selectedCurrency as Currency}
            options={currencyOptions || []}
            error={!!valueError && areErrorsVisible}
          />
        </div>

        {bankOptions.length > 0 && (
          <BankSelect
            value={bankValue}
            options={bankOptions || []}
            onChange={handleBankChange}
            placeholder="Выберите банк получения"
            error={bankError && areErrorsVisible ? bankError : null}
          />
        )}
        {position === "received" && (
          <div className="-mb-16">
            {isPhoneNumberUsed ? (
              <InputWrapper
                error={
                  phoneNumberError && areErrorsVisible ? phoneNumberError : null
                }
              >
                <Input
                  onChange={handlePhoneNumberChange}
                  onKeyDown={handlePhoneKeyDown}
                  value={phoneNumberValue ?? ""}
                  type="text"
                  className=" border border-transparent rounded-6 bg-[var(--background-secondary)] placeholder:text-[var(--text-light)] text-16 leading-normal px-18 py-15 w-full"
                  placeholder="Введите номер телефона"
                />
              </InputWrapper>
            ) : (
              <InputWrapper
                error={
                  cardNumberError && areErrorsVisible ? cardNumberError : null
                }
              >
                <Input
                  onChange={handleCardNumberChange}
                  onKeyDown={handleKeyDown}
                  value={cardNumberValue ?? ""}
                  type="text"
                  className=" border border-transparent rounded-6 bg-[var(--background-secondary)] placeholder:text-[var(--text-light)] text-16 leading-normal px-18 py-15 w-full"
                  placeholder="Номер карты"
                />
              </InputWrapper>
            )}
          </div>
        )}
      </div>
    );
  }
);

ExchangeCardInput.displayName = "ExchangeCardInput";

export default ExchangeCardInput;
