export const sanitizeHex = (input: string): string => {
  return input.replace(/[^0-9A-Fa-f\s]/g, "");
};

export const isValidHex = (hex: string): boolean => {
  return /^[0-9A-Fa-f\s]*$/.test(hex);
};

export const normalizeHex = (hex: string): string[] => {
  return hex
    .replace(/\s/g, "")
    .toUpperCase()
    .match(/.{1,2}/g) || [];
};
