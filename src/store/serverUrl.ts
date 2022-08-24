import {createSlice} from '@reduxjs/toolkit';
// import {appStorage} from 'src/app/app-storage';

export interface ServerUrlState {
  baseUrl?: string | null;
}

const initialState: ServerUrlState = {
  baseUrl: "appStorage.serverUrl",
};

export const serverUrlSlice = createSlice({
  name: 'baseUrl',
  initialState,
  reducers: {
    changeServerUrl: (
      state: ServerUrlState,
      action: {
        type: string;
        payload: string;
      },
    ) => {
      state.baseUrl = action.payload;
    },
  },
});