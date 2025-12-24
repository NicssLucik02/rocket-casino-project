import { motion } from "framer-motion";
import styles from "./plinko-ball.module.scss";
import type { Pin } from "../../../../../../types/Types";
import { usePlinkoBallPhysics } from "../../../../../../hooks/usePlinkoBallPhysics";

type Props = {
  index: number;
  dropId: number;
  isPlaying: boolean;
  slotsCount: number;
  pins: Pin[];
  pinSize: number;
  boardRef: React.RefObject<HTMLDivElement | null>;
  onFinish: (slotIndex: number) => void;
};

export const PlinkoBall: React.FC<Props> = ({
  index,
  isPlaying,
  slotsCount,
  pins,
  pinSize,
  boardRef,
  onFinish,
}) => {
  const { left, top } = usePlinkoBallPhysics({
    index,
    isPlaying,
    slotsCount,
    pins,
    pinSize,
    boardRef,
    onFinish,
  });

  return (
    <motion.div className={styles.ball} style={{ left, top }}>
      <div className={styles.ballHighlight} />
      <div className={styles.ballShadow} />
    </motion.div>
  );
};
