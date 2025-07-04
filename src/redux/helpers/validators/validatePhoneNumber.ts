export interface ValidatePhoneNumberProps {
  phoneNumber: string | null;
  isPhoneNumberUsed: boolean;
}

export const validatePhoneNumber = ({ phoneNumber, isPhoneNumberUsed }: ValidatePhoneNumberProps): string | null => {
  if (!isPhoneNumberUsed) {
    return null;
  }

  if (!phoneNumber) {
    return "Номер телефона обязателен";
  }

  // Remove all non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  // Check if it's 11 digits and starts with 8
  if (digitsOnly.length !== 11) {
    return "Номер телефона должен содержать 11 цифр";
  }

  if (!digitsOnly.startsWith('8')) {
    return "Номер телефона должен начинаться с 8";
  }

  return null;
}; 