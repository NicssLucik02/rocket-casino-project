import styles from "./gamebar.module.scss";
import classNames from "classnames";

type Props = {
  icon: string;
  title: string;
  handleChangeBar: (value: string) => void;
  activeBar?: string | null;
  disabled?: boolean;
};

export const GameBar: React.FC<Props> = ({
  icon,
  title,
  handleChangeBar,
  activeBar,
  disabled,
}) => {
  const handleClick = () => {
    if (disabled) return;
    handleChangeBar(title);
  };

  return (
    <div
      className={classNames(styles["gamebar"], {
        [styles["active-bar"]]: activeBar === title,
        [styles["gamebar--disabled"]]: !!disabled,
      })}
      onClick={handleClick}
    >
      <p>{icon}</p>
      <p>{title}</p>
    </div>
  );
};
