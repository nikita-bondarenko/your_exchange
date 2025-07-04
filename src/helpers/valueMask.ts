export const valueMask = (value: number | null | undefined): string => {
  if (typeof value !== 'number' ||isNaN(value)) return "";
  const stringVal = value.toString().replace(".", ",");
  const maskedValue = formatWithSpaces(stringVal);
  return maskedValue;
};

export const formatWithSpaces = (value: string) => {
  const [intPart, decPart] = value.split(",");
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return decPart !== undefined ? `${formattedInt},${decPart}` : formattedInt;
};

export const normalizeInput = (val: string) => {
  return val
    .replace(/[^\d.,]/g, "")
    .replace(/[,\.]{2,}/g, "")
    .replace(/[.]/g, ",");
};

export const formatWithSpacesCardNumber = (value: string) => {
  return value.replace(/(.{4})/g, "$1 ").trim()

};

export const formatPhoneNumber = (value: string) => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // If starts with 8, keep it, otherwise add 8
  let cleanDigits = digits;
  if (!digits.startsWith('8') && digits.length > 0) {
    cleanDigits = '8' + digits;
  }
  
  // Apply mask: 8 (999) 999 99 99
  if (cleanDigits.length === 0) return '';
  if (cleanDigits.length === 1) return cleanDigits;
  if (cleanDigits.length <= 4) return `${cleanDigits.charAt(0)} (${cleanDigits.slice(1)}`;
  if (cleanDigits.length <= 7) return `${cleanDigits.charAt(0)} (${cleanDigits.slice(1, 4)}) ${cleanDigits.slice(4)}`;
  if (cleanDigits.length <= 9) return `${cleanDigits.charAt(0)} (${cleanDigits.slice(1, 4)}) ${cleanDigits.slice(4, 7)} ${cleanDigits.slice(7)}`;
  
  return `${cleanDigits.charAt(0)} (${cleanDigits.slice(1, 4)}) ${cleanDigits.slice(4, 7)} ${cleanDigits.slice(7, 9)} ${cleanDigits.slice(9, 11)}`;
};

export const normalizePhoneInput = (value: string) => {
  return value.replace(/\D/g, '');
};

