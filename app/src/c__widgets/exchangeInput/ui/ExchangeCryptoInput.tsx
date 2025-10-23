import React, { memo, useEffect, useState } from "react";
import { CurrencyPosition } from "../../../entities/requestDetails/ui/RequestDetails";
import CurrencyInput from "../../../entities/currency/ui/CurrencyInput";
import { useAppDispatch, useAppSelector } from "@/shared/model/store/hooks";
import {
  selectSectionHeadingProps,
  selectCurrencyOptions,
  selectNetsOptions,
  selectNetValue,
  selectWalletAddressValue,
  selectWalletAddressError,
  selectAreErrorsVisible,
  selectCurrency,
} from "@/shared/model/store/selectors";

import { usePlaceholder } from "@/shared/lib/exchange/usePlaceholder";
import { InputWrapper } from "../../../shared/ui/form/InputWrapper";
import { Input } from "../../../shared/ui/form/Input";
import CryptoNetSelect, {
  CryptoNetOption,
} from "../../../entities/network/ui/CryptoNetSelect";
import { useExchangeInput } from "@/shared/lib/exchange/useExchangeInput";
import {
  setSelectedNetworkValue,
  setWalletAddressValue,
} from "@/shared/model/store/reducers/exchangeReducer";
import clsx from "clsx";
import { Currency } from "@/shared/api/types";
import { SectionHeading } from "@/shared/ui/exchange/SectionHeading";
import { MinValueNote } from "./MinValueNote";

export type ExchangeCryptoInputProps = {
  position: CurrencyPosition;
};

const ExchangeCryptoInput: React.FC<ExchangeCryptoInputProps> = memo(
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
    const netsOptions = useAppSelector(selectNetsOptions);
    const networks = useAppSelector((state) => state.exchange.networks);
    const netValue = useAppSelector(selectNetValue);
    const walletAddressValue = useAppSelector(selectWalletAddressValue);
    const walletAddressError = useAppSelector(selectWalletAddressError);

    const placeholder = usePlaceholder(position, "COIN");

    // Обработка изменения валюты
    useEffect(() => {
      if (isInitialLoad) {
        setIsInitialLoad(false);
        return;
      }
    }, []);

    const handleNetChange = (net: CryptoNetOption) => {
      const network = networks?.find((network) => network.id === net.id);
      if (network) {
        dispatch(setSelectedNetworkValue(network));
      }
    };

    const handleWalletAddressChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      dispatch(setWalletAddressValue(e.target.value));
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

        {netsOptions.length > 0 && (
          <div className="mt-13">
            <SectionHeading title="Выберите сеть" />
            <CryptoNetSelect
              onChange={handleNetChange}
              value={netValue as CryptoNetOption}
              options={netsOptions || []}
            />
          </div>
        )}

        {position === "received" && (
          <div
            className={clsx("mt-0", {
              "mt-20": netsOptions.length > 0,
            })}
          >
            <InputWrapper
              error={
                walletAddressError && areErrorsVisible
                  ? walletAddressError
                  : null
              }
            >
              <Input
                className="border border-[var(--border-placeholder)] rounded-6 bg-[var(--background-secondary)] text-16 leading-normal px-18 py-15 pr-30 w-full"
                type="text"
                onChange={handleWalletAddressChange}
                value={walletAddressValue ?? ""}
                placeholder={
                  netValue
                    ? `Адрес кошелька в сети ${netValue?.name}`
                    : `Адрес кошелька`
                }
              />
            </InputWrapper>
          </div>
        )}
      </div>
    );
  }
);

ExchangeCryptoInput.displayName = "ExchangeCryptoInput";

export default ExchangeCryptoInput;
