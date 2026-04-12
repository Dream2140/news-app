'use client';

import { Container, Typography, Divider } from '@mui/material';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { redirect } from 'next/navigation';
import { UserRole } from '@newsapp/shared';
import UserList from '@/components/admin/UserList';
import FetchNews from '@/components/admin/FetchNews';

export default function AdminPage() {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated || user?.role !== UserRole.ADMIN) {
    redirect('/');
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
        Users
      </Typography>
      <UserList />

      <Divider sx={{ my: 4 }} />

      <FetchNews />
    </Container>
  );
}
