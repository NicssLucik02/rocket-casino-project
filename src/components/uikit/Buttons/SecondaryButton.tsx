type Props = {
    amount: string;
    widthSize: string;
}

export const SecondaryButton: React.FC<Props> = ({ amount, widthSize }) => {
    return (
        <div style={{
            height:"36px", 
            width:`${widthSize}%`, 
            backgroundColor: 'rgba(15, 23, 43, 0.5)', 
            borderRadius:'8px', 
            display:'flex', 
            alignItems:'center',
            justifyContent:'center',
            border:'1px solid rgba(49, 65, 88, 1)',
            cursor:'pointer',
            }}
            >
            ${amount}
        </div>
    )
}