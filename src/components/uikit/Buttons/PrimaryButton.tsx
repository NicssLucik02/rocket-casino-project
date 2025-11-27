type Props = {
    text: string;
    widthSize: string;
    bgColor1: string;
    bgColor2: string;
    icon?: string;
    handler?: () => void;
}

export const PrimaryButton: React.FC<Props> = ({ text, widthSize, bgColor1, bgColor2, icon, handler }) => {
    return (
        <button 
          onClick={handler}
          style={{
              height:"36px", 
              width:`${widthSize}%`, 
              background:`linear-gradient(to right, ${bgColor1}, ${bgColor2}`, 
              borderRadius:'8px', 
              display:'flex', 
              alignItems:'center',
              justifyContent:'center',
              border:'none',
              cursor:'pointer',
            }}
        >
            {icon && (<img src={icon} style={{marginRight: '4px'}} alt="icon" />)}
            {text}
        </button>
    )
}