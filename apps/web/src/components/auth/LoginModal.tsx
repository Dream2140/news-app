'use client';

import { useState } from 'react';
import {
  Button,
  CircularProgress,
  Fade,
  FormHelperText,
  Modal,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '@/contexts/AuthContext';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { apiClient } from '@/lib/api-client';

type ModalMode = 'login' | 'register' | 'forgot';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const { login, register, isLoading, error, clearError } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [mode, setMode] = useState<ModalMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'forgot') {
      setForgotLoading(true);
      try {
        await apiClient.post('/user/forgot-password', { email });
        showSnackbar('Reset link sent! Check your email.', 'success');
        handleClose();
      } catch {
        showSnackbar('Failed to send reset email', 'error');
      } finally {
        setForgotLoading(false);
      }
      return;
    }

    const success =
      mode === 'login' ? await login(email, password) : await register(nickname, email, password);

    if (success) handleClose();
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setNickname('');
    setMode('login');
    clearError();
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const title =
    mode === 'login' ? 'Welcome back' : mode === 'register' ? 'Create account' : 'Reset password';

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Fade in={open}>
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            width: { xs: '90vw', sm: 400 },
            maxWidth: 400,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1.5,
              }}
            >
              <LockOutlinedIcon sx={{ color: 'white' }} />
            </Box>
            <Typography variant="h6">{title}</Typography>
            {mode === 'forgot' && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, textAlign: 'center' }}
              >
                Enter your email and we&apos;ll send a reset link
              </Typography>
            )}
          </Box>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <TextField
                label="Nickname"
                fullWidth
                margin="normal"
                size="small"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                slotProps={{ htmlInput: { minLength: 2 } }}
              />
            )}
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {mode !== 'forgot' && (
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                slotProps={{ htmlInput: { minLength: 8 } }}
              />
            )}

            {error && (
              <FormHelperText error sx={{ mt: 1 }}>
                {error}
              </FormHelperText>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2.5, height: 44, borderRadius: 2 }}
              disabled={isLoading || forgotLoading}
            >
              {isLoading || forgotLoading ? (
                <CircularProgress size={22} color="inherit" />
              ) : mode === 'login' ? (
                'Sign In'
              ) : mode === 'register' ? (
                'Sign Up'
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>

          {mode === 'login' && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1.5,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { color: 'primary.main' },
              }}
              onClick={() => {
                setMode('forgot');
                clearError();
              }}
            >
              Forgot password?
            </Typography>
          )}

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1.5,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { color: 'primary.main' },
            }}
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              clearError();
            }}
          >
            {mode === 'register' ? (
              <>
                Already have an account? <b>Sign In</b>
              </>
            ) : (
              <>
                Don&apos;t have an account? <b>Sign Up</b>
              </>
            )}
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
}
