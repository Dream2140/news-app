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
} from '@mui/material';
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
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            minWidth: 320,
          }}
        >
          <form onSubmit={handleSubmit}>
            {!isLoginMode && (
              <TextField
                label="Nickname"
                fullWidth
                margin="normal"
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              slotProps={{ htmlInput: { minLength: 6 } }}
            />

            {error && <FormHelperText error>{error}</FormHelperText>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, height: 45 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isLoginMode ? (
                'Login'
              ) : (
                'Register'
              )}
            </Button>
          </form>

          <Box
            sx={{ mt: 2, cursor: 'pointer', textAlign: 'center' }}
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              dispatch(clearError());
            }}
          >
            {isLoginMode ? (
              <p>
                Don&apos;t have an account? <b>Register</b>
              </p>
            ) : (
              <p>
                Already have an account? <b>Login</b>
              </p>
            )}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
