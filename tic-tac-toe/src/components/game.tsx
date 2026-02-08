import React, { useEffect, useRef, useState } from "react";
import Board from "./board";

export const THEMES = ["light", "dark", "ocean", "forest", "sunset", "lavender"] as const;
export type Theme = (typeof THEMES)[number];

const getInitialTheme = (): Theme => {
    const stored = localStorage.getItem("theme");
    if (stored && THEMES.includes(stored as Theme)) return stored as Theme;

    try {
        if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) return "dark";
    } catch {
        // ignore
    }
    return "light";
};

const themeLabels: Record<Theme, string> = {
    light: "Light",
    dark: "Dark",
    ocean: "Ocean",
    forest: "Forest",
    sunset: "Sunset",
    lavender: "Lavender",
};

const Game: React.FC = () => {
    const [squares, setSquares] = useState<("X" | "O" | null)[]>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [theme, setTheme] = useState<Theme>(getInitialTheme);
    const [themeDialogOpen, setThemeDialogOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (themeDialogOpen) dialog.showModal();
        else dialog.close();
    }, [themeDialogOpen]);

    const selectTheme = (t: Theme) => {
        setTheme(t);
        setThemeDialogOpen(false);
    };

    const calculateWinner = (squares: ("X" | "O" | null)[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        for (let line of lines) {
            const [a, b, c] = line;
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const handleClick = (i: number) => {
        if (squares[i] || calculateWinner(squares)) return;
        const nextSquares = squares.slice();
        nextSquares[i] = isXNext ? "X" : "O";
        setSquares(nextSquares);
        setIsXNext(!isXNext);
    };

    const restartGame = () => {
        setSquares(Array(9).fill(null));
        setIsXNext(true);
    };

    const winner = calculateWinner(squares);
    const isDraw = squares.every(Boolean) && !winner;
    const status = winner
        ? `Winner: ${winner}`
        : isDraw
            ? "Draw!"
            : `Next player: ${isXNext ? "X" : "O"}`;

    return (
        <>
            <button
                className="settings-button"
                type="button"
                onClick={() => setThemeDialogOpen(true)}
                aria-label="Settings"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
            </button>

            <div className="game">
                <h1 className="game-title">Tic-Tac-Toe</h1>

            <dialog ref={dialogRef} className="theme-dialog" onCancel={() => setThemeDialogOpen(false)}>
                <h2 className="theme-dialog-title">Choose theme</h2>
                <div className="theme-options">
                    {THEMES.map((t) => (
                        <button
                            key={t}
                            type="button"
                            className={`theme-option ${t === theme ? "theme-option--active" : ""}`}
                            onClick={() => selectTheme(t)}
                            data-theme-preview={t}
                        >
                            {themeLabels[t]}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    className="theme-dialog-close"
                    onClick={() => setThemeDialogOpen(false)}
                >
                    Close
                </button>
            </dialog>
            <Board squares={squares} onClick={handleClick} />
            <div className="status">{status}</div>
            <button className="restart" onClick={restartGame}>
                Restart Game
            </button>
            </div>

            {winner && (
                <div className="winner-overlay" role="alert">
                    <div className="winner-popup">
                        <div className={`winner-badge winner-badge--${winner.toLowerCase()}`}>
                            {winner}
                        </div>
                        <p className="winner-message">Wins!</p>
                        <button className="winner-restart" onClick={restartGame}>
                            Play Again
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Game;
