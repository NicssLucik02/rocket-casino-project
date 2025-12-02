import "./gamebar.scss";
import classNames from "classnames";

type Props = {
  icon: string;
  title: string;
  handleChangeBar: (value: string) => void;
  activeBar?: string;
  disabled?: boolean;
};

export const GameBar: React.FC<Props> = ({
  icon,
  title,
  handleChangeBar,
  activeBar,
  disabled,
}) => {
  return (
    <div
      className={classNames("gamebar", {
        "active-bar": activeBar === title,
        "gamebar--disabled": !!disabled,
      })}
      onClick={() => {
        if (disabled) return;
        handleChangeBar(title);
      }}
    >
      <p>{icon}</p>
      <p>{title}</p>
    </div>
  );
};
