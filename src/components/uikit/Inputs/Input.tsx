type Props = {
    placeholderValue: string;
    type: string;
    bgColor: string;
    widthSize: string;
    inputValue?: string | number;
    name?: string;
    handler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PrimaryInput: React.FC<Props> = ({placeholderValue, type, bgColor, widthSize, inputValue, handler, name}) => {
    return (
            <input 
                type={type}
                name={name}
                className="home-game__main-controls__input" 
                placeholder={placeholderValue}
                value={inputValue}
                onChange={handler}
                style={{
                    width:`${widthSize}%`, 
                    height:'36px', 
                    borderRadius:'8px', 
                    padding:'0 0 0 12px', 
                    backgroundColor: `${bgColor}`,
                    border: 'none',
                }}
            />
    )
}