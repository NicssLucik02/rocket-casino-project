import type { Pin } from "../../../../../../types/Types";
import styles from "./plinko-pins.module.scss";

type Props = {
  pins: Pin[];
  pinSize: number;
  pinOpacity: number;
};

export const PlinkoPins: React.FC<Props> = ({ pins, pinSize, pinOpacity }) => (
  <div className={styles.pyramid}>
    {pins.map((pin) => (
      <div
        key={pin.key}
        className={styles.pin}
        style={{
          left: `${pin.x * 100}%`,
          top: `${pin.y * 100}%`,
          width: `${pinSize}px`,
          height: `${pinSize}px`,
          opacity: pinOpacity,
        }}
      >
        <div className={styles.pinGlow} />
      </div>
    ))}
  </div>
);