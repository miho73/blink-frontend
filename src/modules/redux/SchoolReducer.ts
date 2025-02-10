import {createSlice, PayloadAction} from "@reduxjs/toolkit";

enum SchoolReduxState {
  INIT = 0,
  LOADING = 1,
  VERIFIED = 2,
  NOT_VERIFIED = 3,
  ERROR = 4,
}

interface SchoolStateType {
  schoolUUID: string | null;
  schoolNeisCode: string | null;
  schoolName: string | null;
  grade: number | null;

  state: SchoolReduxState;
}

const initialState: SchoolStateType = {
  schoolUUID: null,
  schoolNeisCode: null,
  schoolName: null,
  grade: null,

  state: SchoolReduxState.INIT,
}

const schoolSlice = createSlice({
  name: 'schoolReducer',
  initialState,
  reducers: {
    loadSchool: (state: SchoolStateType, action: PayloadAction<SchoolStateType>) => {
      state.schoolUUID = action.payload.schoolUUID;
      state.schoolNeisCode = action.payload.schoolNeisCode;
      state.schoolName = action.payload.schoolName;
      state.grade = action.payload.grade;
      state.state = action.payload.state;
    },
    resetSchool: (state: SchoolStateType) => {
      state.schoolUUID = null;
      state.schoolNeisCode = null;
      state.schoolName = null;
      state.grade = null;

      state.state = SchoolReduxState.INIT;
    },
    setState: (state: SchoolStateType, action: PayloadAction<SchoolReduxState>) => {
      state.state = action.payload;
    }
  }
});

export const actions = schoolSlice.actions;
export {SchoolReduxState};
export type {SchoolStateType};
export default schoolSlice.reducer;
