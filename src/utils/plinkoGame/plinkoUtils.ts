export const getSlotGradient = (multiplier: number): string => {
  if (multiplier >= 1000) return "linear-gradient(135deg, #FFD700, #FFA500, #FF8C00, #FF4500)";
  if (multiplier >= 100) return "linear-gradient(135deg, #FF00FF, #FF1493, #FF69B4)";
  if (multiplier >= 10) return "linear-gradient(135deg, #9D00FF, #BA55D3, #DA70D6)";
  if (multiplier >= 5) return "linear-gradient(135deg, #FF6B6B, #FF8E53)";
  if (multiplier >= 2) return "linear-gradient(135deg, #4ECDC4, #44A08D)";
  if (multiplier >= 1) return "linear-gradient(135deg, #45B7D1, #96CEB4)";
  if (multiplier >= 0.5) return "linear-gradient(135deg, #FFEAA7, #FAB1A0)";
  return "linear-gradient(135deg, #636E72, #2D3436)";
};

export const formatMultiplier = (m: number): string => {
  if (m >= 100) return `${m}x`;
  if (Number.isInteger(m)) return `${m}x`;
  return `${m.toFixed(2).replace(/\.?0+$/, "")}x`;
};

export const createBallIds = (count: number, seed: number): string[] => {
  return Array.from({ length: count }, (_, i) =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${seed}-${Date.now()}-${i}-${Math.random().toString(16).slice(2)}`
  );
};

export const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));