import { FC, useCallback, useEffect, useRef, useState } from "react";
import { doSetGameOver, doSetStartTime, doSetWinnerPlayer } from "../app/globalSlice";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { gridSize, winnerCount } from "../consts/common";

type NumberOrNull = number | null;

interface IBoard {
    handleClickOnCell: (col: NumberOrNull, row: NumberOrNull) => void;
}

const Board: FC<IBoard> = ({ handleClickOnCell }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasSize = gridSize > 30 ? gridSize * 20 : gridSize * 30;
    const [winningLine, setWinningLine] = useState<number[][] | null>(null);
    const dispatch = useAppDispatch();
    const { startTime, squares } = useAppSelector((selector) => selector.globalSice);

    const drawBoard = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            // Draw the board
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.fillStyle = "#f2eecb";

            // Draw vertical and horizontal lines
            for (let i = 1; i < gridSize; i++) {
                const position = (canvasSize / gridSize) * i;

                if (i === 1) {
                    const firstPoint = position - canvasSize / gridSize;

                    ctx.beginPath();
                    ctx.moveTo(firstPoint, 0);
                    ctx.lineTo(firstPoint, canvasSize);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(0, firstPoint);
                    ctx.lineTo(canvasSize, firstPoint);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(canvasSize, 0);
                    ctx.lineTo(canvasSize, canvasSize);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(0, canvasSize);
                    ctx.lineTo(canvasSize, canvasSize);
                    ctx.stroke();
                }

                // Draw vertical lines
                ctx.beginPath();
                ctx.moveTo(position, 0);
                ctx.lineTo(position, canvasSize);
                ctx.stroke();

                // Draw horizontal lines
                ctx.beginPath();
                ctx.moveTo(0, position);
                ctx.lineTo(canvasSize, position);
                ctx.stroke();
            }

            // Draw the winning line
            if (winningLine && winningLine.length > 0) {
                ctx.beginPath();
                const cellSize = canvasSize / gridSize;

                const startX = winningLine[0][0] * cellSize + cellSize / 2;
                const startY = winningLine[0][1] * cellSize + cellSize / 2;
                ctx.moveTo(startX, startY);

                for (let i = 1; i < winningLine.length; i++) {
                    const x = winningLine[i][0] * cellSize + cellSize / 2;
                    const y = winningLine[i][1] * cellSize + cellSize / 2;
                    ctx.lineTo(x, y);
                }

                ctx.lineWidth = 5;
                ctx.strokeStyle = "#1F6E8C";
                ctx.stroke();
            }
        },
        [canvasSize, winningLine]
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas === null) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillRect(0, 0, canvasSize, canvasSize);
        drawBoard(ctx);

        // Draw X and O
        ctx.lineWidth = 2;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const square = squares?.[i]?.[j];
                if (square) {
                    const centerX = (i + 0.5) * (canvasSize / gridSize);
                    const centerY = (j + 0.5) * (canvasSize / gridSize);
                    const radius = (canvasSize / gridSize - 10) / 2;

                    ctx.beginPath();
                    if (square === "X") {
                        ctx.moveTo(centerX - radius, centerY - radius);
                        ctx.lineTo(centerX + radius, centerY + radius);
                        ctx.moveTo(centerX + radius, centerY - radius);
                        ctx.lineTo(centerX - radius, centerY + radius);
                        ctx.strokeStyle = "#FF0000";
                    } else if (square === "O") {
                        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                        ctx.strokeStyle = "#0000FF";
                    }
                    ctx.stroke();
                }
            }
        }
    }, [canvasSize, drawBoard, squares]);

    useEffect(() => {
        const calculateWinner = () => {
            const lines = [];
            // check horizontal & Vertical Line
            for (let i = 0; i < gridSize; i++) {
                // columns
                const columns = [];
                const rows = [];
                for (let j = 0; j < gridSize; j++) {
                    const column = {
                        row: i,
                        col: j,
                        value: squares[j][i],
                    };
                    columns.push(column);

                    const row = {
                        row: j,
                        col: i,
                        value: squares[i][j],
                    };
                    rows.push(row);
                }
                lines.push(rows);
                lines.push(columns);
            }

            // check diagonals left to right
            for (let i = 0; i < gridSize; i++) {
                const diagonalLeftToRightTop = [];
                const diagonalLeftToRightBottom = [];

                const diagonalRightToLeftTop = [];
                const diagonalRightToLeftBottom = [];

                for (let j = 0; j < gridSize; j++) {
                    if (i + j < gridSize) {
                        diagonalLeftToRightTop.push({
                            col: i + j,
                            row: j,
                            value: squares[i + j][j],
                        });
                        diagonalLeftToRightBottom.push({
                            col: j,
                            row: i + j,
                            value: squares[j][i + j],
                        });

                        const col = gridSize - 1 - (i + j);
                        diagonalRightToLeftTop.push({
                            col: col,
                            row: j,
                            value: squares[i + j][col],
                        });

                        const row = gridSize - 1 - j;
                        diagonalRightToLeftBottom.push({
                            col: i + j,
                            row: row,
                            value: squares[row][i + j],
                        });
                    }
                }

                lines.push(diagonalLeftToRightTop);
                lines.push(diagonalLeftToRightBottom);

                lines.push(diagonalRightToLeftTop);
                lines.push(diagonalRightToLeftBottom);
            }

            for (const line of lines) {
                let countX = 0;
                let countO = 0;
                let winningLine: number[][] | null = null;

                for (let i = 0; i < line.length; i++) {
                    const { value: square, row, col } = line[i];

                    if (square === "X") {
                        countX++;
                        countO = 0;
                    } else if (square === "O") {
                        countO++;
                        countX = 0;
                    } else {
                        countX = 0;
                        countO = 0;
                    }

                    if (countX === winnerCount || countO === winnerCount) {
                        dispatch(doSetGameOver(true));
                        const endIndex = i;
                        const startIndex = endIndex - winnerCount + 1;
                        const valueColEnd = col;
                        const valueRowEnd = row;

                        const valueColStart = line[startIndex].col;
                        const valueRowStart = line[startIndex].row;

                        // check diagonals right to left
                        if (valueColEnd < valueColStart && valueRowEnd > valueRowStart) {
                            winningLine = [
                                [valueColEnd, valueRowEnd],
                                [valueRowStart, valueColStart],
                            ];
                        } else {
                            winningLine = [
                                [valueColEnd, valueRowEnd],
                                [valueColStart, valueRowStart],
                            ];
                        }
                        setWinningLine(winningLine);
                        return square === "X" ? "X" : "O";
                    }
                }
            }

            setWinningLine(null);
            return null;
        };

        const winnerPlayer = calculateWinner();
        if (winnerPlayer) {
            dispatch(doSetWinnerPlayer(winnerPlayer));
            dispatch(doSetStartTime("RESET"));
        }
    }, [dispatch, squares, startTime]);

    const clickEmptyCell = (event: React.MouseEvent<HTMLElement>) => {
        if (!startTime) dispatch(doSetStartTime("SET"));

        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;

        const row = Math.floor(x / (canvasSize / gridSize));
        const col = Math.floor(y / (canvasSize / gridSize));
        handleClickOnCell(row, col);
    };

    const handleExportPng = () => {
        if (canvasRef.current) {
            const dataURL = canvasRef.current.toDataURL("image/png");

            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "tictoctoe";

            link.click();
        }
    };

    return (
        <div>
            <canvas className="canvasBoard" ref={canvasRef} width={canvasSize} height={canvasSize} onClick={clickEmptyCell} />

            <div className="container-action">
                <div className="group-btn">
                    <button onClick={handleExportPng} className="btn">
                        Export to Png
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Board;
