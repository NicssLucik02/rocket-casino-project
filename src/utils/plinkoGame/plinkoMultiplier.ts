import { RiskLevel } from "../../types/enums";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const roundTo = (n: number, step: number) => Math.round(n / step) * step;

export const calculatePlinkoMultipliers = (
  linesCount: number,
  risk: RiskLevel,
): number[] => {
  const slots = linesCount;
  const center = (slots - 1) / 2;

  const base = Array.from({ length: slots }, (_, i) => {
    const t = center === 0 ? 0 : Math.abs(i - center) / center;

    if (risk === RiskLevel.Low) {
      const raw = 1.4 - 0.9 * t + 4.5 * Math.pow(t, 6);
      return roundTo(clamp(raw, 0.5, 5), 0.1);
    }

    if (risk === RiskLevel.Medium) {
      const raw = 1.6 - 1.4 * t + 20 * Math.pow(t, 7);
      return roundTo(clamp(raw, 0.3, 20), 0.1);
    }

    if (t <= 0.08) return 0;
    if (t <= 0.18) return 0.2;
    if (t <= 0.32) return 0.6;
    if (t <= 0.48) return 1.2;
    if (t <= 0.62) return 3;
    if (t <= 0.74) return 10;
    if (t <= 0.84) return 25;
    if (t <= 0.92) return 100;
    if (t <= 0.97) return 250;
    return 1000;
  });

  const centerIndices = Array.from({ length: slots }, (_, i) => i)
    .sort((a, b) => {
      const da = Math.abs(a - center);
      const db = Math.abs(b - center);
      return da !== db ? da - db : a - b;
    })
    .slice(0, Math.min(3, slots));

  const adjusted = base.slice();
  for (const idx of centerIndices) {
    adjusted[idx] = Math.min(adjusted[idx] ?? 0, 0.8);
  }

  return adjusted;
};
