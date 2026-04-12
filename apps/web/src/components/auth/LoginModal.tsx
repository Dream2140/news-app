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
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { loginUser, registerUser, clearError } from '@/store/slices/authSlice';
import { closeModal } from '@/store/slices/uiSlice';

interface LoginModalProps {
  open: boolean;
}

export default function LoginModal({ open }: LoginModalProps) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoginMode) {
      const result = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(result)) {
        dispatch(closeModal());
        resetForm();
      }
    } else {
      const result = await dispatch(registerUser({ nickname, email, password }));
      if (registerUser.fulfilled.match(result)) {
        dispatch(closeModal());
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setNickname('');
    dispatch(clearError());
  };

  const handleClose = () => {
    dispatch(closeModal());
    resetForm();
  };

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
            <Typography variant="h6">{isLoginMode ? 'Welcome back' : 'Create account'}</Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            {!isLoginMode && (
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
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={22} color="inherit" />
              ) : isLoginMode ? (
                'Sign In'
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 2.5,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { color: 'primary.main' },
            }}
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              dispatch(clearError());
            }}
          >
            {isLoginMode ? (
              <>
                Don&apos;t have an account? <b>Sign Up</b>
              </>
            ) : (
              <>
                Already have an account? <b>Sign In</b>
              </>
            )}
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
}
