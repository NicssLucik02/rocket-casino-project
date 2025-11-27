import './home.scss';
import { HomeBonus } from './HomeBonus/HomeBonus';
import { HomeGame } from './HomeGame/HomeGame';

export const Home = () => {
    return (
        <section className="home">
            <div className="home__container">
                <HomeGame />
                <HomeBonus />    
            </div>
        </section>
    )
}