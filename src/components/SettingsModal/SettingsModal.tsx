import './settingsModal.scss';
import { useEffect, useState } from "react";
import { PrimaryInput } from "../uikit/Inputs/Input";
import { PrimaryButton } from '../uikit/Buttons/PrimaryButton';
import { X } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { useBalance } from '../../hooks/useBalance';

export const SettingsModal = ({ onClose }: { onClose: () => void }) => {
    const [changeUserName, setChangeUserName] = useState<string>('');
    const [userNameError, setUserNameError] = useState<string>('');
    const [gamesPlayed, setGamesPlayed] = useState<number>(0);
    const { balance } = useBalance();

    const handleChangeUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setChangeUserName(value);
        
        if (value.length > 20) {
            setUserNameError('Username cannot exceed 20 characters');
        } else {
            setUserNameError('');
        }
    }

    useEffect(() => {
        const load = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
    
          const { data } = await supabase.from("profiles").select("wins", ).eq("id", user.id).single();
          setGamesPlayed(data?.wins ?? 0);
    
          supabase
            .channel(`wins-${user.id}`)
            .on("postgres_changes", { 
              event: "UPDATE", 
              schema: "public",
              table: "profiles", 
              filter: `id=eq.${user.id}` 
            }, 
              (payload) => setGamesPlayed(payload.new.wins ?? 0)
            )
            .subscribe();
        };
        load();
      }, []);

    return (
        <div className="settings-modal__wrapper">
            <div className="settings-modal__overlay" onClick={onClose}></div>
            <div className="settings-modal">
                <X onClick={onClose} className="settings-modal__close-icon" size={20} />
                <div className="settings-modal__container">
                    <div className="settings-modal__top">
                        <p className="settings-modal__top-title">
                            Profile Settings
                        </p>
                        <p className="settings-modal__top-subtitle">
                            Customize your profile and manage your account
                        </p>

                        <div>
                            <p className="settings-modal__input-text">
                                <img src="./src/assets/icons/User.svg" alt="user" />
                                Username
                            </p>
                            <PrimaryInput 
                              placeholderValue={'John Doe'} 
                              type={"text"} 
                              widthSize={'100'} 
                              inputValue={changeUserName} 
                              handler={handleChangeUserName}
                            />

                            <p className={`settings-modal__input-ch-counter ${userNameError ? 'settings-modal__input-ch-counter--error' : ''}`}>
                                {changeUserName.length} / 20 characters
                            </p>
                            {userNameError && (
                                <p className="settings-modal__input-error">{userNameError}</p>
                            )}
                        </div>

                        <div className="settings-modal__panel">
                            <p className="settings-modal__panel-title">Account Stats</p>
                            <div className="settings-modal__panel-info">

                                <div className="settings-modal__panel-item">
                                    <p className="settings-modal__panel-item-desc">Balance</p>
                                    <p className="settings-modal__panel-item-value">${balance}</p>
                                </div>

                                <div className="settings-modal__panel-item">
                                    <p className="settings-modal__panel-item-desc">Games Played</p>
                                    <p className="settings-modal__panel-item-value">{gamesPlayed}</p>
                                </div>

                                <div className="settings-modal__panel-item">
                                    <p className="settings-modal__panel-item-desc">Total wagered</p>
                                    <p className="settings-modal__panel-item-value">$20.00</p>
                                </div>
                                
                                <div className="settings-modal__panel-item">
                                    <p className="settings-modal__panel-item-desc">Total won</p>
                                    <p className="settings-modal__panel-item-value">$45.4</p>
                                </div>
                            </div>
                        </div>

                        <div className="settings-modal__actions">
                            <PrimaryButton text="Save Changes" widthSize="50" bgColor1="rgba(21, 93, 252, 1)" bgColor2="rgba(152, 16, 250, 1)" />
                            <PrimaryButton text="Reset Account" widthSize="50" bgColor1="rgba(212, 24, 61, 1)" bgColor2='rgb(126, 9, 32)' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}