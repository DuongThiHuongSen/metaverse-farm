import {createSlice} from '@reduxjs/toolkit';
// import {appStorage} from 'src/app/app-storage';
// import type {AppUser} from 'src/models';

export interface AppUser{
    id:string,
    username:string,
    password: string,
    displayName?: string
}
export interface UserState {
  userLogin?: AppUser;
  token?: string | null;
  user?: AppUser;
  apartmentId?: string | null;
  estateId?: string | null;
}

const initialState: UserState = {
  userLogin: {
    id:'1',
    username:'',
    password:'',
    displayName:'summer'
  },
//   token: appStorage.token,
//   apartmentId: appStorage.apartmentId,
};

export const userSlice = createSlice({
  name: 'userLogin',
  initialState,
  reducers: {
    changeUserLogin: (
      state: UserState,
      action: {
        type: string;
        payload: AppUser;
      },
    ) => {
      state.userLogin = action.payload;
    },
    changeToken: (
      state: UserState,
      action: {
        type: string;
        payload: string;
      },
    ) => {
      state.token = action.payload;
    },
    changeUser: (
      state: UserState,
      action: {
        type: string;
        payload: AppUser;
      },
    ) => {
      state.user = action.payload;
    },
    changeAparmentId: (
      state: UserState,
      action: {
        type: string;
        payload: string;
      },
    ) => {
      state.apartmentId = action.payload;
    },
    changeEstateId: (
      state: UserState,
      action: {
        type: string;
        payload: string;
      },
    ) => {
      state.estateId = action.payload;
    },
    removeUser: (state: UserState) => {
      state.user = undefined;
    },
  },
});