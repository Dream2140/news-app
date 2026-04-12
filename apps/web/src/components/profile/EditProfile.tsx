'use client';

import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { apiClient } from '@/lib/api-client';

export default function EditProfile() {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [nickname, setNickname] = useState(user?.nickname ?? '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    try {
      await apiClient.put(`/user/update-user/${user.id}`, { nickname });
      showSnackbar('Nickname updated', 'success');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      showSnackbar(e.response?.data?.message ?? 'Update failed', 'error');
    } finally {
      setIsLoading(false);
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
      <Button type="submit" variant="contained" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Update'}
      </Button>
    </Box>
  );
}
