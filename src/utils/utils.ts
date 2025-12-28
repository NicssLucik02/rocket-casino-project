export const formatNumber = (value: number | undefined) =>
  value?.toFixed(2) || "0.00";

export const isValidBetAmount = (
  value: string | number,
  min: number = 1,
): boolean => {
  const strValue = String(value);
  if (strValue === "") return true;
  const numValue = Number(strValue);
  return !isNaN(numValue) && numValue >= min;
};
