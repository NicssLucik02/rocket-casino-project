import { useForm } from '../../assets/hooks/useForm';
import './header.scss';

export const Header = () => {
    const { handleLogout } = useForm();
    return (
        <header className="header">
            <div className="header__title">
                <img src="../../src/assets/icons/Logo.svg" alt="logo" />
                Rocket Casino
            </div>

            <div className="header__actions">
                <div className="header__actions-wallet">
                    <img 
                      className="wallet-icon" 
                      src="../../src/assets/icons/Wallet.svg" 
                      alt="wallet" 
                    />
                    <p>$1000.00</p>
                </div>
                <div className="header__actions-settings">
                    <img src="../../src/assets/icons/Settings.svg" alt="settings" />
                </div>
                
                <div className="header__actions-logout" onClick={() => handleLogout()}>
                    <img
                      className="logout-icon"
                      src="../../src/assets/icons/Logout.svg" 
                      alt="logout" 
                    />
                    Logout
                </div>
            </div>
        </header>
    )
}