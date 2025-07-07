import { AppDispatch } from "../store";
import { RootState } from "../store";
import {
  setSelectedBankError,
  setCardNumberError,
  setPhoneNumberError,
  setSelectedCityError,
  setCurrencySellAmountError,
  setCurrencyBuyAmountError,
  setWalletAddressError,
  setAreErrors,
} from "../slices/exchangeSlice/exchangeSlice";
import { validateExchangeInput } from "./validateExchangeInput";

export const validateAllFields = (
  state: RootState,
  dispatch: AppDispatch
) => {
  const { selectedCurrencySellType, selectedCurrencyBuyType, banks, cities } = state.exchange;
  let hasErrors = false;

  // Validate crypto fields
  if (selectedCurrencySellType === "COIN" || selectedCurrencyBuyType === "COIN") {
    const { currencySellAmount, currencyBuyAmount, walletAddress, exchangeRate } = state.exchange;
    const position = selectedCurrencySellType === "COIN" ? "given" : "received";

    const amountError = validateExchangeInput({
      value: position === "given" ? currencySellAmount.value : currencyBuyAmount.value,
      inputType: "amount",
      position,
      minValue: exchangeRate?.currency_give_min_value || 0,
    });

    const walletAddressError = validateExchangeInput({
      value: walletAddress.value,
      inputType: "walletAddress",
      position,
      minValue: 0,
    });

    if (position === "given") {
      dispatch(setCurrencySellAmountError(amountError));
    } else {
      dispatch(setCurrencyBuyAmountError(amountError));
    }
    dispatch(setWalletAddressError(walletAddressError));

    // // console.log('amountError, walletAddressError',amountError, walletAddressError);

    hasErrors = !!(amountError || walletAddressError);
  }

  // Validate card fields
  if (selectedCurrencySellType === "BANK" || selectedCurrencyBuyType === "BANK") {
    const { currencySellAmount, currencyBuyAmount, selectedBank, cardNumber, phoneNumber, isPhoneNumberUsed, exchangeRate } = state.exchange;
    const position = selectedCurrencySellType === "BANK" ? "given" : "received";

    const amountError = validateExchangeInput({
      value: position === "given" ? currencySellAmount.value : currencyBuyAmount.value,
      inputType: "amount",
      position,
      minValue: exchangeRate?.currency_give_min_value || 0,
    });

    const bankError = banks && banks.length > 0 ? validateExchangeInput({
      value: selectedBank.value,
      inputType: "bank",
      position,
      minValue: 0,
    }) : null;

    // Validate either phone number or card number based on isPhoneNumberUsed
    let cardNumberError = null;
    let phoneNumberError = null;
    
    if (isPhoneNumberUsed) {
      phoneNumberError = validateExchangeInput({
        value: phoneNumber?.value || null,
        inputType: "phoneNumber",
        position,
        minValue: 0,
        isPhoneNumberUsed: true,
      });
    } else {
      cardNumberError = validateExchangeInput({
        value: cardNumber.value,
        inputType: "cardNumber",
        position,
        minValue: 0,
      });
    }

    if (position === "given") {
      dispatch(setCurrencySellAmountError(amountError));
    } else {
      dispatch(setCurrencyBuyAmountError(amountError));
    }
    dispatch(setSelectedBankError(bankError));
    dispatch(setCardNumberError(cardNumberError));
    dispatch(setPhoneNumberError(phoneNumberError));
    // // console.log('amountError, bankError, cardNumberError',amountError, bankError, cardNumberError, banks);

    hasErrors = hasErrors || !!(amountError || bankError || cardNumberError || phoneNumberError);
  }

  // Validate cash fields
  if (selectedCurrencySellType === "CASH" || selectedCurrencyBuyType === "CASH") {
    const { currencySellAmount, currencyBuyAmount, selectedCity, exchangeRate } = state.exchange;
    const position = selectedCurrencySellType === "CASH" ? "given" : "received";

    

    const amountError = validateExchangeInput({
      value: position === "given" ? currencySellAmount.value : currencyBuyAmount.value,
      inputType: "amount",
      position,
      minValue: exchangeRate?.currency_give_min_value || 0,
    });

    const cityError = cities && cities.length > 0 ? validateExchangeInput({
      value: selectedCity.value,
      inputType: "city",
      position,
      minValue: 0,
    }) : null;

    if (position === "given") {
      dispatch(setCurrencySellAmountError(amountError));
    } else {
      dispatch(setCurrencyBuyAmountError(amountError));
    }
    dispatch(setSelectedCityError(cityError));
    // // console.log('amountError, cityError',amountError, cityError);

    hasErrors = hasErrors || !!(amountError || cityError);
  }

  dispatch(setAreErrors(hasErrors));
  return hasErrors;
}; 