'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import { apiClient } from '@/lib/api-client';
import { Suspense } from 'react';

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post('/user/reset-password', { token, password });
      setSuccess(true);
      setTimeout(() => router.push('/'), 3000);
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      setError(apiErr.response?.data?.message ?? 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <Container sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Invalid Reset Link
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          This password reset link is invalid or has expired.
        </Typography>
      </Container>
    );
  }

  if (success) {
    return (
      <Container sx={{ mt: 8, textAlign: 'center' }}>
        <Alert severity="success" sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}>
          Password reset successfully!
        </Alert>
        <Typography color="text.secondary">Redirecting to home page...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <LockResetIcon sx={{ color: 'white', fontSize: 28 }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Set New Password
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5, textAlign: 'center' }}>
          Enter your new password below
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          size="small"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          slotProps={{ htmlInput: { minLength: 8 } }}
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          size="small"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2.5, height: 44, borderRadius: 2 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Reset Password'}
        </Button>
      </form>
    </Container>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      }
    >
      <ResetForm />
    </Suspense>
  );
}
