import './homeBonus.scss';
import { PrimaryButton } from "../../uikit/Buttons/PrimaryButton"
import { useBalanceContext } from '../../../contexts/BalanceContext';
import { useState, useEffect } from 'react';

export const HomeBonus = () => {
    const { addBonus } = useBalanceContext();
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    useEffect(() => {
        const savedTime = localStorage.getItem('bonusCooldown');
        if (savedTime) {
            const endTime = parseInt(savedTime, 10);
            const now = Date.now();
            const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
            
            if (remaining > 0) {
                setTimeLeft(remaining);
                setIsDisabled(true);
            } else {
                localStorage.removeItem('bonusCooldown');
            }
        }
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) {
            setIsDisabled(false);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsDisabled(false);
                    localStorage.removeItem('bonusCooldown');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleClaimBonus = async () => {
        if (isDisabled) return;

        await addBonus();

        const endTime = Date.now() + 60000;
        localStorage.setItem('bonusCooldown', endTime.toString());
        setTimeLeft(60);
        setIsDisabled(true);
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="home-bonus">
            <div className="home-bonus__container">
                <div className="home-bonus__title">
                    <img src="/rocket-casino-project/src/assets/icons/Bonus.svg" alt="bonus" />
                    <div>
                        <p className="home-bonus__title-text">Claim Bonus</p>
                        <p className="home-bonus__title-text--small">Free money every minute</p>
                    </div>
                </div>
                <div className="home-bonus__panel">
                    <p className="home-bonus__panel-item">
                        <span>
                            Next claim:
                        </span>
                        <span className="home-bonus__panel-item__time">
                            <img src="/rocket-casino-project/src/assets/icons/Time.svg" alt="clock" className="bonus-time-icon"/>
                            {timeLeft > 0 ? formatTime(timeLeft) : '1:00'}
                        </span>
                    </p>
                    <p className="home-bonus__panel-item">
                        <span>Amount:</span>
                        <span className="home-bonus__panel-item__reward">$10</span>
                    </p>
                </div>
                <PrimaryButton 
                    text={isDisabled ? `Wait ${formatTime(timeLeft)}` : 'Claim Now!'} 
                    widthSize={'100'} 
                    bgColor1={isDisabled ? 'rgba(100, 100, 100, 1)' : 'rgba(0, 153, 102, 1)'} 
                    bgColor2={isDisabled ? 'rgba(80, 80, 80, 1)' : 'rgba(0, 166, 62, 1)'}
                    handler={handleClaimBonus}
                />
            </div>
        </div>
    )
}