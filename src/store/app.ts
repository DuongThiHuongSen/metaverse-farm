import { createSlice } from '@reduxjs/toolkit';
import { AppLanguage } from 'types/AppLanguage';
import { AppState } from '../types/AppState';

const initialState : AppState = {
    // language: AppLanguage.VIETNAMESE,
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        changeLanguage: (
            state: {
                // language: AppLanguage;
            },
            action: {
                type: string;
                payload: AppLanguage;
            },
        ) => {
            // state.language = action.payload;
            // localization.changeLanguage(action.payload);
        },
    },
});
