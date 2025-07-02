import { ValidationOptions } from "../types";

export type ValidateAmountProps = {
  value: number | null;
  options?: ValidationOptions;
};

export const validateAmount = ({ value, options }: ValidateAmountProps): string | null => {
  if (options?.position === "received") {
    return null;
  }
  if (value === null) {
    return "Введите сумму";
  }

  if (options?.minValue && value < options.minValue) {
    return `Минимальная сумма ${options.minValue}`;
  }

  return null;
}; 