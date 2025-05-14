import { useState, useTransition, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import './Game.css';

type Cell = 'X' | 'O' | null;

export default function Game() {


    const [inputSize, setInputSize] = useState<number>(5);
    const [inputWinLen, setInputWinLen] = useState<number>(4);


    const [size, setSize] = useState<number | null>(null);
    const [winLen, setWinLen] = useState<number | null>(null);


    const emptyBoard = size != null ? Array(size * size).fill(null) as Cell[] : [];
    const [board, setBoard] = useState<Cell[]>(emptyBoard);
    const [xIsNext, setXIsNext] = useState(true);
    const [winner, setWinner] = useState<'X' | 'O' | 'Draw' | null>(null);
    const [isPending, startTransition] = useTransition();


    useEffect(() => {
        if (winner) {
            console.log(`Game won by: ${winner}`);
        }
    }, [winner]);


    const startGame = () => {
        setSize(inputSize);
        setWinLen(inputWinLen);
        setBoard(Array(inputSize * inputSize).fill(null));
        setXIsNext(true);
        setWinner(null);
    };


    const handleClick = (idx: number) => {

        if (winner || board[idx]) {
            console.log("Move rejected: ", winner ? "Game already won" : "Cell filled");
            return;
        }

        if (!size || !winLen) return;

        void isPending;
        startTransition(() => {

            const next = board.slice();
            next[idx] = xIsNext ? 'X' : 'O';
            setBoard(next);


            const win = calculateWinner(next, size, winLen, idx);

            if (win) {
                console.log(`Win detected for ${win}`);
                setWinner(win);
            } else if (!next.includes(null)) {
                console.log("Draw detected");
                setWinner('Draw');
            } else {
                setXIsNext(!xIsNext);
            }
        });
    };


    const resetAll = () => {
        setSize(null);
        setWinLen(null);
        setWinner(null);
    };


    if (size == null || winLen == null) {

        return (
            <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
                <h2>Setup Your Game</h2>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Board size:&nbsp;
                        <input
                            type="number"
                            min={3}
                            max={20}
                            value={inputSize}
                            onChange={e => setInputSize(parseInt(e.target.value, 10) || 3)}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Win condition:&nbsp;
                        <input
                            type="number"
                            min={3}
                            max={inputSize}
                            value={inputWinLen}
                            onChange={e => setInputWinLen(parseInt(e.target.value, 10) || 3)}
                        />
                    </label>
                </div>
                <Button onClick={startGame}>Start Game</Button>
            </div>
        );
    }


    const statusText =
        winner === 'Draw' ? 'Draw!' :
            winner ? `Winner: ${winner}` :
                `Next player: ${xIsNext ? 'X' : 'O'}`;

    return (
        <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
            <h2 className='text-center font-bold text-2xl'>{statusText}</h2>
            <Board
                size={size}
                board={board}
                onClick={handleClick}
                winner={winner}
            />
            <div style={{ marginTop: 12 }}>
                <Button variant="outline" onClick={() => {
                    setBoard(Array(size * size).fill(null));
                    setXIsNext(true);
                    setWinner(null);
                }}>
                    Reset Board
                </Button>
                &nbsp;
                <Button variant="link" onClick={resetAll}>
                    Change Settings
                </Button>
            </div>
        </div>
    );
}

interface BoardProps {
    size: number;
    board: Cell[];
    onClick: (i: number) => void;
    winner: 'X' | 'O' | 'Draw' | null;
}

function Board({ size, board, onClick, winner }: BoardProps) {
    return (
        <div
            className="board"
            style={{ "--size": size } as React.CSSProperties}
        >
            {board.map((val, idx) => (
                <button
                    key={idx}
                    className="square"
                    onClick={() => onClick(idx)}
                    disabled={winner !== null}
                >
                    {val}
                </button>
            ))}
        </div>
    );
}

function calculateWinner(
    board: Cell[],
    size: number,
    winLen: number,
    lastIdx: number
): Cell {

    if (lastIdx === -1) return null;

    const currentPlayer = board[lastIdx];
    if (!currentPlayer) return null;


    const row = Math.floor(lastIdx / size);
    const col = lastIdx % size;


    const directions = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1]
    ];


    for (const [dr, dc] of directions) {
        let count = 1;


        for (let i = 1; i < winLen; i++) {
            const r = row + dr * i;
            const c = col + dc * i;


            if (r >= 0 && r < size && c >= 0 && c < size && board[r * size + c] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }


        for (let i = 1; i < winLen; i++) {
            const r = row - dr * i;
            const c = col - dc * i;


            if (r >= 0 && r < size && c >= 0 && c < size && board[r * size + c] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }


        if (count >= winLen) {
            return currentPlayer;
        }
    }

    return null;
}