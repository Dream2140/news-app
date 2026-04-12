'use client';

import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { changePassword } from '@/store/slices/profileSlice';
import { showSnackbar } from '@/store/slices/uiSlice';

export default function ChangePassword() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const result = await dispatch(
      changePassword({ userId: user.id, currentPassword, newPassword }),
    );

    if (changePassword.fulfilled.match(result)) {
      dispatch(showSnackbar({ message: 'Password updated', severity: 'success' }));
      setCurrentPassword('');
      setNewPassword('');
    } else {
      dispatch(showSnackbar({ message: result.payload as string, severity: 'error' }));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
      <TextField
        label="Current Password"
        type="password"
        fullWidth
        margin="normal"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />
      <TextField
        label="New Password"
        type="password"
        fullWidth
        margin="normal"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        slotProps={{ htmlInput: { minLength: 6 } }}
      />
      <Button type="submit" variant="contained">
        Change Password
      </Button>
    </Box>
  );
}
