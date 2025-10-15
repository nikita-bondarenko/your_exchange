import { CurrencyPosition } from "@/entities/requestDetails/ui/RequestDetails";
import { ValidatedField } from "./types";
import { validators } from "./validators";

export type ValidateExchangeInput = (props: {
  value: unknown;
  inputType: ValidatedField;
  position: CurrencyPosition;
  minValue: number;
  isPhoneNumberUsed?: boolean;
}) => string | null;

export const validateExchangeInput: ValidateExchangeInput = ({ value, inputType, position, minValue, isPhoneNumberUsed = false }) => {
  const validator = validators[inputType];

  if (!validator) {
    console.warn(`No specific validator found for input type: ${inputType}. Returning null.`);
    return null;
  }

  if (inputType === 'amount') {
    return (validator as any)({
      value: value === null ? null : Number(value),
      options: { minValue, position }
    });
  }

  if (inputType === 'phoneNumber') {
    return (validator as any)({
      value: value === null ? null : String(value),
      options: { position }
    });
  }



  return (validator as any)({
    value: value === null ? null : String(value),
    options: { position }
  });
}; 