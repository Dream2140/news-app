'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { refreshAuth } from '@/store/slices/authSlice';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    const hasToken = typeof window !== 'undefined' && localStorage.getItem('accessToken');
    if (hasToken && !isAuthenticated) {
      dispatch(refreshAuth());
    }
  }, [dispatch, isAuthenticated]);

  return <>{children}</>;
}
