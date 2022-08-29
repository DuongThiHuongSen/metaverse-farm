import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '../types/AppState';

const initialState: AppState = {
    appReady: false,
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppReady: (
            state: {
                appReady?: boolean;
            },
            action: {
                payload: boolean;
            },
        ) => {
            state.appReady = action.payload;
        },
    },
});
