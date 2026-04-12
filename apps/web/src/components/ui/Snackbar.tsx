'use client';

import { Snackbar, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { hideSnackbar } from '@/store/slices/uiSlice';

export default function AppSnackbar() {
  const dispatch = useAppDispatch();
  const { open, message, severity } = useAppSelector((state) => state.ui.snackbar);

  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={() => dispatch(hideSnackbar())}>
      <Alert onClose={() => dispatch(hideSnackbar())} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
