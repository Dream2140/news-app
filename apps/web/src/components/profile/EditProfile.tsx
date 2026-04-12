'use client';

import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { updateUserData } from '@/store/slices/profileSlice';
import { showSnackbar } from '@/store/slices/uiSlice';

export default function EditProfile() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [nickname, setNickname] = useState(user?.nickname ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const result = await dispatch(updateUserData({ userId: user.id, data: { nickname } }));
    if (updateUserData.fulfilled.match(result)) {
      dispatch(showSnackbar({ message: 'Nickname updated', severity: 'success' }));
    } else {
      dispatch(showSnackbar({ message: result.payload as string, severity: 'error' }));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
      <TextField
        label="Nickname"
        fullWidth
        margin="normal"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        slotProps={{ htmlInput: { minLength: 2 } }}
      />
      <Button type="submit" variant="contained">
        Update
      </Button>
    </Box>
  );
}
