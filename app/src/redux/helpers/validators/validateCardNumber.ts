import { ValidationOptions } from "../types";

export type ValidateCardNumberProps = {
  value: string | null;
  options?: ValidationOptions;
};

export const validateCardNumber = ({ value, options }: ValidateCardNumberProps): string | null => {
  if (options?.position === "given") {
    return null;
  }
  
  if (!value || value.length === 0) {
    return "Введите номер карты";
  }

  // Remove spaces and dashes
  const cleanNumber = value.replace(/[\s-]/g, "");
// // // console.log(cleanNumber)
  // Check if the number is between 16 and 19 digits
  if (cleanNumber.length < 16 || cleanNumber.length > 19) {
    return "Номер карты должен содержать от 16 до 19 цифр";
  }

  // Luhn algorithm for card number validation
  // let sum = 0;
  // let isEven = false;

  // // Loop through values starting from the rightmost digit
  // for (let i = cleanNumber.length - 1; i >= 0; i--) {
  //   let digit = parseInt(cleanNumber.charAt(i));

  //   if (isEven) {
  //     digit *= 2;
  //     if (digit > 9) {
  //       digit -= 9;
  //     }
  //   }

  //   sum += digit;
  //   isEven = !isEven;
  // }

  // if (sum % 10 !== 0) {
  //   return "Неверный номер карты";
  // }

  return null;
}; 