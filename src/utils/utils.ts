export const formatNumber = (value: number | undefined) =>
  value?.toFixed(2) || "0.00";
