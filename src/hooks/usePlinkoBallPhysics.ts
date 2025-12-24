import { useEffect } from "react";
import { useMotionValue } from "framer-motion";
import type { Pin } from "../types/Types";
import { PLINKO_BALL_CONFIG } from "../constants";

type Props = {
  index: number;
  isPlaying: boolean;
  slotsCount: number;
  pins: Pin[];
  pinSize: number;
  boardRef: React.RefObject<HTMLDivElement | null>;
  onFinish: (slotIndex: number) => void;
};

export const usePlinkoBallPhysics = ({
  index,
  isPlaying,
  slotsCount,
  pins,
  pinSize,
  boardRef,
  onFinish,
}: Props) => {
  const left = useMotionValue(0);
  const top = useMotionValue(0);

  useEffect(() => {
    if (!isPlaying) return;

    const el = boardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);

    const pinRadius = Math.max(4, pinSize / 2);
    const collisionRadius = PLINKO_BALL_CONFIG.BALL_RADIUS + pinRadius;
    const collisionRadiusSq = collisionRadius * collisionRadius;

    const minX = PLINKO_BALL_CONFIG.BALL_RADIUS;
    const maxX = width - PLINKO_BALL_CONFIG.BALL_RADIUS;
    const ySlots = height * 0.85;

    const slotsCountSafe = Math.max(1, slotsCount);
    const slotsLeft = width * 0.06;
    const slotsRight = width * 0.94;
    const slotsWidth = Math.max(1, slotsRight - slotsLeft);
    const slotMaxIndex = slotsCountSafe - 1;

    const startJitter = Math.min(Math.max((index - slotMaxIndex / 2) * 0.01, -0.035), 0.035);
    const startXNormalized = Math.min(Math.max(0.5 + startJitter, 0.05), 0.95);

    let x = startXNormalized * width;
    let y = 0;
    let vx = (Math.random() - 0.5) * 260 + startJitter * 1600;
    let vy = 0;

    left.set(x);
    top.set(y);

    const pinsPx = pins.map((p) => ({
      key: p.key,
      x: p.x * width,
      y: p.y * height,
    }));

    let raf = 0;
    let lastT = performance.now();
    let finished = false;
    const lastPinHitAt: Record<string, number> = {};

    const finish = () => {
      if (finished) return;
      finished = true;

      const t = Math.min(Math.max((x - slotsLeft) / slotsWidth, 0), 0.999999);
      const slotIndex = Math.floor(t * slotsCountSafe);
      onFinish(Math.min(Math.max(slotIndex, 0), slotMaxIndex));
    };

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;

      let remaining = dt;
      while (remaining > 0 && !finished) {
        const subDt = Math.min(remaining, 1 / 120);
        remaining -= subDt;

        vy += PLINKO_BALL_CONFIG.GRAVITY * subDt;
        x += vx * subDt;
        y += vy * subDt;

        vx *= PLINKO_BALL_CONFIG.AIR_DRAG;
        vy *= PLINKO_BALL_CONFIG.AIR_DRAG;

        if (x < minX) {
          x = minX;
          vx = -vx * PLINKO_BALL_CONFIG.WALL_RESTITUTION;
        } else if (x > maxX) {
          x = maxX;
          vx = -vx * PLINKO_BALL_CONFIG.WALL_RESTITUTION;
        }

        for (const pin of pinsPx) {
          if (Math.abs(y - pin.y) > collisionRadius * 2.5) continue;
          if (Math.abs(x - pin.x) > collisionRadius * 2.5) continue;

          const dx = x - pin.x;
          const dy = y - pin.y;
          const distSq = dx * dx + dy * dy;
          if (distSq >= collisionRadiusSq) continue;

          const lastHit = lastPinHitAt[pin.key] ?? -Infinity;
          if (now - lastHit < PLINKO_BALL_CONFIG.PIN_HIT_COOLDOWN) continue;
          lastPinHitAt[pin.key] = now;

          const dist = Math.sqrt(Math.max(0.0001, distSq));
          const nx = dx / dist;
          const ny = dy / dist;

          x = pin.x + nx * (collisionRadius + 0.5);
          y = pin.y + ny * (collisionRadius + 0.5);

          const vn = vx * nx + vy * ny;
          if (vn < 0) {
            const impulse = (1 + PLINKO_BALL_CONFIG.RESTITUTION) * vn;
            vx -= impulse * nx;
            vy -= impulse * ny;

            const tx = -ny;
            const ty = nx;
            const jitter = (Math.random() - 0.5) * 160;
            vx += tx * jitter;
            vy += ty * jitter * 0.18;
          }
        }

        if (y >= ySlots) {
          y = ySlots;
          finish();
        }
      }

      left.set(x);
      top.set(y);

      if (!finished) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      finished = true;
    };
  }, [
    isPlaying,
    index,
    slotsCount,
    pins,
    pinSize,
    boardRef,
    onFinish,
    left,
    top,
  ]);

  return { left, top };
};
