'use client';

import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { apiClient } from '@/lib/api-client';

export default function ChangePassword() {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    try {
      await apiClient.put(`/user/update-password/${user.id}`, { currentPassword, newPassword });
      showSnackbar('Password updated', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      showSnackbar(e.response?.data?.message ?? 'Failed', 'error');
    } finally {
      setIsLoading(false);
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
        slotProps={{ htmlInput: { minLength: 8 } }}
      />
      <Button type="submit" variant="contained" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Change Password'}
      </Button>
    </Box>
  );
}
