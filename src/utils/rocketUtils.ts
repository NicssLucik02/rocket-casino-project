import { formatNumber } from "./utils";

export const generateCrashPoint = (): number => {
  const houseEdge = 0.01;
  const r = Math.random();
  const crash = 1 / (1 - r * (1 - houseEdge));
  return Math.max(1.1, Math.min(crash, 100));
};

export const formatCoeff = (value: number): string => {
  return formatNumber(value);
};