import {combineReducers} from "redux";
import userInfoReducer from "./UserInfoReducer.ts";
import boardReducer from "./BoardReducer.ts";
import {configureStore} from "@reduxjs/toolkit";
import schoolReducer from "./SchoolReducer.ts";

const rootReducer = combineReducers({
  userInfoReducer,
  boardReducer,
  schoolReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: true
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
