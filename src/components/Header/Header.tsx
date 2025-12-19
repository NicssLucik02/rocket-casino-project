import { useForm } from "../../hooks/useForm";
import { useState } from "react";
import styles from "./header.module.scss";
import { useBalanceContext } from "../../contexts/balanceContextBase";
import { ClipLoader } from "react-spinners";
import { formatNumber } from "../../utils/utils";
import LogoIcon from "@/assets/icons/logo.svg?react";
import WalletIcon from "@/assets/icons/Wallet.svg?react";
import SettingsIcon from "@/assets/icons/Settings.svg?react";
import LogoutIcon from "@/assets/icons/Logout.svg?react";
import { Menu } from "lucide-react";

type Props = {
  onSettingsClick: () => void;
};

export const Header: React.FC<Props> = ({ onSettingsClick }) => {
  const { handleLogout } = useForm();
  const { balance } = useBalanceContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((p) => !p);
  const closeMenu = () => setMenuOpen(false);
  return (
    <header className={styles.header}>
      <div className={styles["header__title"]}>
        <LogoIcon className={styles["logo-icon"]} />
        Rocket Casino
      </div>

      <div className={styles["header__actions"]}>
        <div className={styles["header__actions-wallet"]}>
          <WalletIcon className={styles["wallet-icon"]} />
          <p>
            {balance !== null ? (
              `$${formatNumber(balance)}`
            ) : (
              <ClipLoader
                color="#00bc6eff"
                size={20}
                className={styles["spin__header"]}
              />
            )}
          </p>
        </div>
        <div
          className={styles["header__actions-settings"]}
          onClick={onSettingsClick}
        >
          <SettingsIcon className={styles["settings-icon"]} />
        </div>

        <div
          className={styles["header__actions-logout"]}
          onClick={handleLogout}
        >
          <LogoutIcon className={styles["logout-icon"]} />
          Logout
        </div>
      </div>

      <div className={styles.burger} onClick={toggleMenu}>
        <Menu className={styles["burger-icon"]} />
      </div>

      {menuOpen && (
        <>
          <div className={styles["header__menu-overlay"]} onClick={closeMenu} />
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
            <div
              className={styles["header__menu-item"]}
              onClick={() => {
                closeMenu();
                onSettingsClick();
              }}
            >
              <SettingsIcon className={styles["settings-icon"]} />
              <span>Settings</span>
            </div>
            <div
              className={styles["header__menu-item"]}
              onClick={() => {
                closeMenu();
                handleLogout();
              }}
            >
              <LogoutIcon className={styles["logout-icon"]} />
              <span>Logout</span>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
