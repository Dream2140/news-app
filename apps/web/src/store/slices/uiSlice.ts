import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

interface UIState {
  modal: { isOpen: boolean; type: string | null };
  snackbar: SnackbarState;
}

const initialState: UIState = {
  modal: { isOpen: false, type: null },
  snackbar: { open: false, message: '', severity: 'info' },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<string>) {
      state.modal = { isOpen: true, type: action.payload };
    },
    closeModal(state) {
      state.modal = { isOpen: false, type: null };
    },
    showSnackbar(
      state,
      action: PayloadAction<{ message: string; severity: SnackbarState['severity'] }>,
    ) {
      state.snackbar = { open: true, ...action.payload };
    },
    hideSnackbar(state) {
      state.snackbar.open = false;
    },
  },
});

export const { openModal, closeModal, showSnackbar, hideSnackbar } = uiSlice.actions;
export default uiSlice.reducer;
