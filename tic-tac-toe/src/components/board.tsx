import React from "react";
import Square from "./square";

interface BoardProps {
    squares: ("X" | "O" | null)[];
    onClick: (i: number) => void;
}

const Board: React.FC<BoardProps> = ({ squares, onClick }) => {
    const renderSquare = (i: number) => (
        <Square value={squares[i]} onClick={() => onClick(i)} />
    );

    return (
        <div>
            {[0, 1, 2].map((row) => (
                <div key={row} className="board-row">
                    {renderSquare(row * 3)}
                    {renderSquare(row * 3 + 1)}
                    {renderSquare(row * 3 + 2)}
                </div>
            ))}
        </div>
    );
};

export default Board;
