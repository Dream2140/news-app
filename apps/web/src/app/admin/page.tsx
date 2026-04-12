'use client';

import { Container, Typography, Divider } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';
import { UserRole } from '@newsapp/shared';
import UserList from '@/components/admin/UserList';
import FetchNews from '@/components/admin/FetchNews';
import AddNews from '@/components/admin/AddNews';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || user?.role !== UserRole.ADMIN) redirect('/');

  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Admin Dashboard
      </Typography>
      <AddNews />
      <Divider sx={{ my: 4 }} />
      <FetchNews />
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" sx={{ mb: 2 }}>
        Users
      </Typography>
      <UserList />
    </Container>
  );
}
