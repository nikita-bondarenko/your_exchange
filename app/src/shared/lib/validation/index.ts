import { Validator } from "./types";
import { validateAmount } from "./validateAmount";
import { validateWalletAddress } from "./validateWalletAddress";
import { validateCardNumber } from "./validateCardNumber";
import { validatePhoneNumber } from "./validatePhoneNumber";
import { validateBank } from "./validateBank";
import { validateCity } from "./validateCity";
import { validateNet } from "./validateNet";

export const validators: Validator = {
  amount: validateAmount,
  walletAddress: validateWalletAddress,
  cardNumber: validateCardNumber,
  phoneNumber: validatePhoneNumber,
  bank: validateBank,
  city: validateCity,
  net: validateNet,
}; 

export * from "./types";
export * from "./validateAmount";
export * from "./validateWalletAddress";
export * from "./validateCardNumber";
export * from "./validatePhoneNumber";
export * from "./validateBank";
export * from "./validateCity";
export * from "./validateNet";
export * from './validateAllFields'
export * from './validateExchangeInput'
export * from './formValidationSchema'
export * from './validateEmail'