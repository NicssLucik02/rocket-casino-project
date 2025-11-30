
import { useForm } from '../../hooks/useForm';
import './header.scss';
import { useBalanceContext } from '../../contexts/BalanceContext';
import { ClipLoader } from 'react-spinners';
import logoIcon from '../../assets/icons/Logo.svg';
import walletIcon from '../../assets/icons/Wallet.svg';
import settingsIcon from '../../assets/icons/Settings.svg';
import logoutIcon from '../../assets/icons/Logout.svg';

type Props = {
    onSettingsClick: () => void 
}
export const Header: React.FC<Props> = ({ onSettingsClick}) => {
    const { handleLogout } = useForm();
    const { balance } = useBalanceContext();
    return (
        <header className="header">
            <div className="header__title">
                <img src={logoIcon} alt="logo" />
                Rocket Casino
            </div>

            <div className="header__actions">
                <div className="header__actions-wallet">
                    <img 
                      className="wallet-icon" 
                      src={walletIcon} 
                      alt="wallet" 
                    />
                        <p>{balance !== null ? `$${balance.toFixed(2)}` : <ClipLoader color="#00bc6eff" size={20} className='spin__header'/>}</p>
                </div>
                <div className="header__actions-settings" onClick={onSettingsClick}>
                    <img src={settingsIcon} alt="settings" />
                </div>
                
                <div className="header__actions-logout" onClick={() => handleLogout()}>
                    <img
                      className="logout-icon"
                      src={logoutIcon} 
                      alt="logout" 
                    />
                    Logout
                </div>
            </div>
        </header>
    )
}
