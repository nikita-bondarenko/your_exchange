import { validateAmount, ValidateAmountProps } from "./validateAmount";
import { validateCardNumber, ValidateCardNumberProps } from "./validateCardNumber";
import { validateCity, ValidateCityProps } from "./validateCity";
import { validateWalletAddress, ValidateWalletAddressProps } from "./validateWalletAddress";
import { validateBank, ValidateBankProps } from "./validateBank";
import { validateNet, ValidateNetProps } from "./validateNet";
import { validatePhoneNumber, ValidatePhoneNumberProps } from "./validatePhoneNumber";

export type ValidatedField = "amount" | "walletAddress" | "cardNumber" | "phoneNumber" | "bank" | "city" | "net";

export type ValidatorProps = {
  amount: ValidateAmountProps;
  walletAddress: ValidateWalletAddressProps;
  cardNumber: ValidateCardNumberProps;
  phoneNumber: ValidatePhoneNumberProps;
  bank: ValidateBankProps;
  city: ValidateCityProps;
  net: ValidateNetProps;
};

export type Validator = {
  [K in ValidatedField]: (props: ValidatorProps[K]) => string | null;
};

export const validators: Validator = {
  amount: validateAmount,
  walletAddress: validateWalletAddress,
  cardNumber: validateCardNumber,
  phoneNumber: validatePhoneNumber,
  bank: validateBank,
  city: validateCity,
  net: validateNet,
}; 