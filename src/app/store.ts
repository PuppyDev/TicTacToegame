import { configureStore } from "@reduxjs/toolkit";
import globalSice from "./globalSlice";

export const store = configureStore({
    reducer: {
        globalSice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
