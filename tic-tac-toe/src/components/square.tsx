import React from "react";

interface SquareProps {
    value: "X" | "O" | null;
    onClick: () => void;
}

const Square: React.FC<SquareProps> = ({ value, onClick }) => {
    const markClass = value ? ` square--${value.toLowerCase()}` : "";
    return (
        <button className={`square${markClass}`} onClick={onClick}>
            {value}
        </button>
    );
};

export default Square;
