import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "./RootReducer.ts";
import {jwtDecode} from "jwt-decode";

interface UserInfoStateType {
  authenticated: boolean;
  initialized: boolean;

  username: string;
  jwt: string;
  role: string[];
}

interface UserSignInType {
  authenticated: boolean;
  initialized: boolean;

  username: string;
  jwt: string;
}

const initialState: UserInfoStateType = {
  authenticated: false,
  initialized: false,

  username: '',
  jwt: '',
  role: []
}

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    signIn: (state: UserInfoStateType, action: PayloadAction<UserSignInType>) => {
      state.authenticated = true;
      state.username = action.payload.username;
      state.jwt = action.payload.jwt;
      state.initialized = true;
      const jwtBody = jwtDecode(action.payload.jwt);
      state.role = <string[]>jwtBody.aud;
    },

    completeInitialization: (state: UserInfoStateType, action: PayloadAction<boolean>) => {
      state.initialized = true;
      state.authenticated = action.payload;
    },

    signOut: (state: UserInfoStateType) => {
      state.authenticated = false;
      state.username = '';
      state.jwt = '';
      state.role = [];
    }
  }
});

export const actions = userInfoSlice.actions;
export const authenticated = (state: RootState) => state.userInfoReducer.authenticated;
export const initialized = (state: RootState) => state.userInfoReducer.initialized;
export default userInfoSlice.reducer;
export type {UserInfoStateType, UserSignInType};
