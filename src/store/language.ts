import { createSlice } from '@reduxjs/toolkit';
// import localization from 'react3l-localization';
import { AppLanguage } from 'types/AppLanguage';

const initialState = {
    language: AppLanguage.VIETNAMESE,
};

export const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        changeLanguage: (
            state: {
                language: AppLanguage;
            },
            action: {
                type: string;
                payload: AppLanguage;
            },
        ) => {
            state.language = action.payload;
            // localization.changeLanguage(action.payload);
        },
    },
});
