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

