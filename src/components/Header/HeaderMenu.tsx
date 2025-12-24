import { ClipLoader } from "react-spinners";
import { formatNumber } from "../../utils/utils";
import styles from "./header.module.scss";
import WalletIcon from "@assets/icons/Wallet.svg?react";
import SettingsIcon from "@assets/icons/Settings.svg?react";
import LogoutIcon from "@assets/icons/Logout.svg?react";

export type HeaderMenuProps = {
  balance: number | null;
  onClose: () => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
};

export const HeaderMenu: React.FC<HeaderMenuProps> = ({
  balance,
  onClose,
  onSettingsClick,
  onLogoutClick,
}) => (
  <>
    <div className={styles["header__menu-overlay"]} onClick={onClose} />
    <div className={styles["header__menu"]}>
      <div className={styles["header__menu-item"]}>
        <WalletIcon className={styles["wallet-icon"]} />
        <span>
          {balance !== null ? (
            `$${formatNumber(balance)}`
          ) : (
            <ClipLoader color="#00bc6eff" size={16} />
          )}
        </span>
      </div>
      <div className={styles["header__menu-item"]} onClick={onSettingsClick}>
        <SettingsIcon className={styles["settings-icon"]} />
        <span>Settings</span>
      </div>
      <div className={styles["header__menu-item"]} onClick={onLogoutClick}>
        <LogoutIcon className={styles["logout-icon"]} />
        <span>Logout</span>
      </div>
    </div>
  </>
);
