import { useEffect, useState } from "react";
import "./App.scss";
import { doSetGameOver, doSetSquares, doSetWinnerPlayer, doSetXIsNext, WinnerPlayerType } from "./app/globalSlice";
import { useAppDispatch, useAppSelector } from "./app/hook";
import ActionNoti from "./components/ActionNoti";
import Board from "./components/Board";
import Statistical from "./components/Statistical";
import { defaultValueSquares } from "./consts/common";

const App = () => {
    const [historyList, setHistoryList] = useState(() => [defaultValueSquares]);
    const [step, setStep] = useState<number>(0);

    const dispatch = useAppDispatch();
    const { isGameOver, xIsNext, squares, winnerPlayer } = useAppSelector((selector) => selector.globalSice);

    const handleClickOnCell = (row: number | null, col: number | null) => {
        if (row === null || col === null) {
            setHistoryList([defaultValueSquares]);
            setStep(0);
            dispatch(doSetWinnerPlayer(null));
            return dispatch(
                doSetSquares({
                    col,
                    row,
                })
            );
        }

        if (squares[row][col] || isGameOver) {
            return;
        }

        const newSquares = squares.map((row) => [...row]);
        newSquares[row][col] = xIsNext ? "X" : "O";

        const newHistory = historyList.slice(0, step + 1);
        setHistoryList([...newHistory, newSquares]);
        setStep(newHistory.length);

        dispatch(
            doSetSquares({
                row,
                col,
            })
        );
        dispatch(doSetXIsNext(!xIsNext));
    };

    const handleStartNewGame = () => {
        dispatch(
            doSetSquares({
                col: null,
                row: null,
            })
        );
        dispatch(doSetWinnerPlayer(null));
        dispatch(doSetGameOver(false));
        dispatch(doSetXIsNext(true));
        setHistoryList([defaultValueSquares]);
        setStep(0);
    };

    useEffect(() => {
        if (isGameOver && winnerPlayer) {
            const statisticals = JSON.parse(localStorage.getItem("statisticals") as string) || [];
            const newStatisticals = {
                step,
                winnerPlayer,
                historyList,
            };
            localStorage.setItem("statisticals", JSON.stringify([...statisticals, newStatisticals]));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isGameOver, winnerPlayer]);
    return (
        <>
            <div className="container">
                <Board handleClickOnCell={handleClickOnCell} />
                <ActionNoti historyList={historyList} step={step} setStep={setStep} startNewGame={handleStartNewGame} />
            </div>
            <Statistical />
            <App.Notify winnerPlayer={winnerPlayer} startNewGame={handleStartNewGame} />
        </>
    );
};

interface IAppNotify {
    winnerPlayer: WinnerPlayerType;
    startNewGame: () => void;
}

App.Notify = ({ winnerPlayer, startNewGame }: IAppNotify) => {
    return (
        <div className={`overlay ${winnerPlayer ? "active" : ""}`}>
            <div className="dialog">
                <h2 className="dialog-title">Winner!</h2>
                <p className="dialog-message">
                    Congratulations! Player{" "}
                    <span className={`dialog-message-winner ${winnerPlayer === "O" ? "blue-color" : "red-color"}`}>{winnerPlayer}</span> is the
                    winner!
                </p>
                <div className="dialog-buttons">
                    <button className="btn" onClick={startNewGame}>
                        New Game
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;
