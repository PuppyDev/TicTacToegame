import { PayloadAction } from "./../../node_modules/@reduxjs/toolkit/src/createAction";
import { createSlice } from "@reduxjs/toolkit";
import { defaultValueSquares } from "../consts/common";

export type WinnerPlayerType = "X" | "O" | null;

export interface IGlobalState {
    xIsNext: boolean;
    isGameOver: boolean;
    startTime: number | null;
    winnerPlayer: WinnerPlayerType;
    squares: string[][];
}

const initialState: IGlobalState = {
    xIsNext: true,
    isGameOver: false,
    startTime: null,
    winnerPlayer: null,
    squares: defaultValueSquares,
};

export const globalSice = createSlice({
    name: "global",
    initialState,
    reducers: {
        doSetXIsNext(state, action: PayloadAction<boolean>) {
            state.xIsNext = action.payload;
        },

        doSetGameOver(state, action: PayloadAction<boolean>) {
            state.isGameOver = action.payload;
        },

        doSetStartTime(state, action: PayloadAction<"RESET" | "SET">) {
            if (action.payload === "RESET") state.startTime = null;
            else if (action.payload === "SET") {
                state.startTime = Date.now();
            }
        },

        doSetWinnerPlayer(state, action: PayloadAction<WinnerPlayerType>) {
            state.winnerPlayer = action.payload;
        },

        doSetSquares(
            state,
            action: PayloadAction<{
                row: number | null;
                col: number | null;
            }>
        ) {
            const { row, col } = action.payload;

            if (!row || !col) {
                state.squares = defaultValueSquares;
            } else {
                const newSquares = state.squares.map((row) => [...row]);
                newSquares[row][col] = state.xIsNext ? "X" : "O";

                state.squares = newSquares;
            }
        },

        doSetSquaresUndoOrRedo(state, action) {
            state.squares = action.payload;
        },
    },
});

export const { doSetGameOver, doSetXIsNext, doSetStartTime, doSetWinnerPlayer, doSetSquares, doSetSquaresUndoOrRedo } = globalSice.actions;

export default globalSice.reducer;
