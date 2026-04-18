'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

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
    mode === 'login' ? 'SECURE UPLINK' : mode === 'register' ? 'NEW IDENTITY' : 'RESET KEY';
  const submitLabel =
    mode === 'login' ? 'AUTHENTICATE ↗' : mode === 'register' ? 'REGISTER NODE ↗' : 'SEND LINK ↗';
  const busy = isLoading || forgotLoading;

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-frame frame" onClick={(e) => e.stopPropagation()}>
        <div className="corner-bl" />
        <div className="corner-br" />
        <button type="button" className="icon-btn modal-x" onClick={handleClose} aria-label="Close">
          ✕
        </button>
        <div className="modal-head">
          <span className="chip" style={{ color: 'var(--mag)' }}>
            <span className="chip-dot" />
            {title}
          </span>
          <div className="display" style={{ fontSize: 22, marginTop: 10 }}>
            {mode === 'login'
              ? 'ДОБРО ПОЖАЛОВАТЬ'
              : mode === 'register'
                ? 'НОВЫЙ УЗЕЛ'
                : 'СБРОС КЛЮЧА'}
          </div>
          {mode === 'forgot' && (
            <div className="label mono" style={{ marginTop: 6, color: 'var(--ink-dim)' }}>
              Enter email // мы отправим ссылку для сброса
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {mode === 'register' && (
            <label className="field">
              <span className="label">NICKNAME</span>
              <input
                className="input"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                minLength={2}
                autoFocus
              />
            </label>
          )}
          <label className="field">
            <span className="label">EMAIL // почта</span>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus={mode !== 'register'}
            />
          </label>
          {mode !== 'forgot' && (
            <label className="field">
              <span className="label">PASSWORD // пароль</span>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </label>
          )}

          {error && (
            <div className="form-error mono" style={{ color: 'var(--red)' }}>
              ⚠ {error}
            </div>
          )}

          <button type="submit" className="btn btn-mag" disabled={busy} style={{ width: '100%' }}>
            {busy ? '::: PROCESSING :::' : submitLabel}
          </button>
        </form>

        <div className="modal-foot">
          {mode === 'login' && (
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setMode('forgot');
                clearError();
              }}
            >
              забыли ключ?
            </button>
          )}
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              clearError();
            }}
          >
            {mode === 'register' ? '← есть аккаунт · LOG IN' : 'создать узел · REGISTER →'}
          </button>
        </div>
      </div>
    </div>
  );
}
