import './home.scss';
import { HomeBonus } from './HomeBonus/HomeBonus';
import { HomeGame } from './HomeGame/HomeGame';
import { Leaderboard } from './Leaderboard/Leaderboard';

export const Home = () => {
    return (
        <section className="home">
            <div className="home__container">
                <HomeGame />
                <div className="home__container-add">
                  <HomeBonus />
                  <Leaderboard />
                </div>
            </div>
        </section>
    )
}