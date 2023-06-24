import { doSetSquaresUndoOrRedo, doSetXIsNext } from "../app/globalSlice";
import { useAppDispatch, useAppSelector } from "../app/hook";

interface IActionNoti {
    step: number;
    setStep: (stepNumber: number) => void;
    historyList: string[][][];
    startNewGame: () => void;
}

const ActionNoti = (props: IActionNoti) => {
    const dispatch = useAppDispatch();
    const { step, setStep, historyList, startNewGame } = props;
    const { xIsNext, winnerPlayer, isGameOver } = useAppSelector((selector) => selector.globalSice);

    const hanleUnOrRedo = (type: "Undo" | "Redo") => {
        const newStep = type === "Undo" ? step - 1 : step + 1;

        if (newStep < 0 || newStep >= historyList.length) {
            return;
        }

        const newSquareList = historyList[newStep];

        setStep(newStep);
        dispatch(doSetSquaresUndoOrRedo(newSquareList));
        dispatch(doSetXIsNext(!xIsNext));
    };

    const disabledBtnUndo = step === 0 || isGameOver || step < historyList.length - 1;
    const disableBtnRedo = step === historyList.length - 1 || isGameOver;

    return (
        <div className="wrap-action">
            <h3>
                TURN PLAYER : <span className={xIsNext ? "red-color" : ""}>{xIsNext ? "X" : "O"}</span>
            </h3>
            <div className="group-btn">
                <button className={`btn`} onClick={() => hanleUnOrRedo("Undo")} disabled={disabledBtnUndo}>
                    Undo
                </button>
                <button className="btn btn-redo" onClick={() => hanleUnOrRedo("Redo")} disabled={disableBtnRedo}>
                    Redo
                </button>
            </div>

            <div>
                <button className="btn" onClick={startNewGame}>
                    Reset Game
                </button>
            </div>
            <h2>
                <p>{winnerPlayer && "Winner: " + winnerPlayer}</p>
            </h2>
        </div>
    );
};

export default ActionNoti;
