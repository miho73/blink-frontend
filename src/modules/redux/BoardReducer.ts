import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "./RootReducer.ts";

interface BoardStateType {
  boardId: string | null;
  boardName: string | null;

  state: number;
}

const initialState: BoardStateType = {
  boardId: null,
  boardName: null,

  state: 0
}

const boardSlice = createSlice({
  name: 'boardReducer',
  initialState,
  reducers: {
    enterBoard: (state: BoardStateType, action: PayloadAction<BoardStateType>) => {
      state.boardId = action.payload.boardId;
      state.boardName = action.payload.boardName;
      state.state = action.payload.state;
    },
    reject: (state: BoardStateType, action: PayloadAction<number>) => {
      state.boardId = null;
      state.boardName = null;
      state.state = action.payload;
    }
  }
});

export const actions = boardSlice.actions;
export const boardId = (state: RootState) => state.boardReducer.boardId;
export const boardName = (state: RootState) => state.boardReducer.boardName;
export default boardSlice.reducer;
