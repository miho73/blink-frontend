import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface DialogViewType {
  title?: string;
  content?: string;
  closeDialogByBackground?: boolean;
  closeText?: string;
  confirmText?: string;
}

interface DialogStateType extends DialogViewType {
  dialogOpen: boolean;
}

const initialState: DialogStateType = {
  dialogOpen: false
}

const dialogSlice = createSlice({
  name: 'dialogReducer',
  initialState,
  reducers: {
    openDialog: (state: DialogStateType, action: PayloadAction<DialogViewType>) => {
      state.dialogOpen = true;
      state.title = action.payload.title;
      state.content = action.payload.content;
      state.closeText = action.payload.closeText || '닫기';
      state.confirmText = action.payload.confirmText || '확인';
      if(action.payload.closeDialogByBackground == undefined) {
        state.closeDialogByBackground = true;
      }
      else state.closeDialogByBackground = action.payload.closeDialogByBackground;
    },

    closeDialog: (state: DialogStateType) => {
      state.dialogOpen = false;
    }
  }
});

export const actions = dialogSlice.actions;
export default dialogSlice.reducer;
