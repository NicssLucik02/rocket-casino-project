import './gamebar.scss';
import classNames from 'classnames';

type Props = {
    icon: string;
    title: string;
    handleChangeBar: (value: string) => void;
    activeBar: string;
}

export const GameBar:React.FC<Props> = ({ icon, title, handleChangeBar, activeBar }) => {
    
    
    return (
        <div 
          className={classNames("gamebar",{"active-bar": activeBar === title})} 
          onClick={() => handleChangeBar(title)}
        >
            <p>{icon}</p>
            <p>{title}</p>
        </div>
    )
}