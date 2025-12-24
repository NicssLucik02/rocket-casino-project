import { useForm } from "../../hooks/useForm";
import { useState } from "react";
import styles from "./header.module.scss";
import { balanceStore } from "../../stores/balanceStore";
import { ClipLoader } from "react-spinners";
import { formatNumber } from "../../utils/utils";
import LogoIcon from "@assets/icons/Logo.svg?react";
import WalletIcon from "@assets/icons/Wallet.svg?react";
import SettingsIcon from "@assets/icons/Settings.svg?react";
import LogoutIcon from "@assets/icons/Logout.svg?react";
import { Menu } from "lucide-react";
import { HeaderMenu } from "./HeaderMenu";

type Props = {
  onSettingsClick: () => void;
};

export const Header: React.FC<Props> = ({ onSettingsClick }) => {
  const { handleLogout } = useForm();
  const balance = balanceStore((s) => s.balance);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((p) => !p);

  const handleMenuSettingsClick = () => {
    toggleMenu();
    onSettingsClick();
  };

  const handleMenuLogoutClick = () => {
    toggleMenu();
    handleLogout();
  };

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
        <HeaderMenu
          balance={balance}
          onClose={toggleMenu}
          onSettingsClick={handleMenuSettingsClick}
          onLogoutClick={handleMenuLogoutClick}
        />
      )}
    </header>
  );
};
