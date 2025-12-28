import styles from "./floating-win.module.scss";
import { motion } from "framer-motion";

type Props = { winAmount: number };

export const FloatingWin: React.FC<Props> = ({ winAmount }) => (
  <motion.div
    className={styles.floatingWin}
    style={{ x: "-50%" }}
    initial={{ y: 0, opacity: 0, scale: 0.95 }}
    animate={{ y: -26, opacity: 1, scale: 1 }}
    exit={{ y: -44, opacity: 0, scale: 1 }}
    transition={{ duration: 1.25, ease: "easeOut" }}
  >
    +${winAmount.toFixed(2)}
  </motion.div>
);