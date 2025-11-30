
import { useForm } from '../../hooks/useForm';
import './header.scss';
import { useBalanceContext } from '../../contexts/BalanceContext';
import { ClipLoader } from 'react-spinners';

type Props = {
    onSettingsClick: () => void 
}
export const Header: React.FC<Props> = ({ onSettingsClick}) => {
    const { handleLogout } = useForm();
    const { balance } = useBalanceContext();
    return (
        <header className="header">
            <div className="header__title">
                <img src="/rocket-casino-project/src/assets/icons/Logo.svg" alt="logo" />
                Rocket Casino
            </div>

            <div className="header__actions">
                <div className="header__actions-wallet">
                    <img 
                      className="wallet-icon" 
                      src="/rocket-casino-project/src/assets/icons/Wallet.svg" 
                      alt="wallet" 
                    />
                        <p>{balance !== null ? `$${balance.toFixed(2)}` : <ClipLoader color="#00bc6eff" size={20} className='spin__header'/>}</p>
                </div>
                <div className="header__actions-settings" onClick={onSettingsClick}>
                    <img src="/rocket-casino-project/src/assets/icons/Settings.svg" alt="settings" />
                </div>
                
                <div className="header__actions-logout" onClick={() => handleLogout()}>
                    <img
                      className="logout-icon"
                      src="/rocket-casino-project/src/assets/icons/Logout.svg" 
                      alt="logout" 
                    />
                    Logout
                </div>
            </div>
        </header>
    )
}