'use client';

import { Container, Typography, Divider } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';
import EditProfile from '@/components/profile/EditProfile';
import ChangePassword from '@/components/profile/ChangePassword';

export default function ProfilePage() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) redirect('/');

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile — {user?.nickname}
      </Typography>
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        Edit Profile
      </Typography>
      <EditProfile />
      <Divider sx={{ my: 4 }} />
      <Typography variant="h6" sx={{ mb: 1 }}>
        Change Password
      </Typography>
      <ChangePassword />
    </Container>
  );
}
