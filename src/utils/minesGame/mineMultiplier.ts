export const calculateMultiplier = (
  revealed: number,
  mines: number,
): number => {
  if (revealed === 0) return 1.0;

  const safeSpots = 25 - mines;
  if (revealed > safeSpots) return 0;

  let multiplier = 1.0;
  for (let i = 0; i < revealed; i++) {
    multiplier *= (25 - i) / (safeSpots - i);
  }
  multiplier *= 0.97;
  return Math.round(multiplier * 100) / 100;
};