import './homeBonus.scss';
import { PrimaryButton } from "../../uikit/Buttons/PrimaryButton"

export const HomeBonus = () => {
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
                                        1:00
                                    </span>
                                </p>
                                <p className="home-bonus__panel-item">
                                    <span>Amount:</span>
                                    <span className="home-bonus__panel-item__reward">$10</span>
                                </p>
                            </div>
                            <PrimaryButton 
                                text={'Claim Now!'} 
                                widthSize={'100'} 
                                bgColor1={'rgba(0, 153, 102, 1)'} 
                                bgColor2={'rgba(0, 166, 62, 1)'}
                            />
                    </div>
                </div>
    )
}