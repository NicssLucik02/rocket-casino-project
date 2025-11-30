type Props = {
  amount: string;
  widthSize: string;
  handler: (event: React.MouseEvent<HTMLDivElement>, amount: string) => void;
};

export const SecondaryButton: React.FC<Props> = ({
  amount,
  widthSize,
  handler,
}) => {
  return (
    <div
      style={{
        height: "36px",
        width: `${widthSize}%`,
        backgroundColor: "rgba(15, 23, 43, 0.5)",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(49, 65, 88, 1)",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "500",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = "rgba(15, 23, 43, 0.7)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = "rgba(15, 23, 43, 0.5)")
      }
      onClick={(event) => handler(event, amount)}
    >
      ${amount}
    </div>
  );
};
