import { CurrencyPosition } from "@/components/request/RequestDetails";
import { ValidatedField, validators } from "./validators";

export type ValidateExchangeInput = (props: {
  value: unknown;
  inputType: ValidatedField;
  position: CurrencyPosition;
  minValue: number;
}) => string | null;

export const validateExchangeInput: ValidateExchangeInput = ({ value, inputType, position, minValue }) => {
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

  return (validator as any)({
    value: value === null ? null : String(value),
    options: { position }
  });
}; 