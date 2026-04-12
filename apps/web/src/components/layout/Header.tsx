'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Avatar, Menu, MenuItem } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { logout } from '@/store/slices/authSlice';
import { openModal } from '@/store/slices/uiSlice';
import LoginModal from '@/components/auth/LoginModal';
import SearchBar from '@/components/ui/SearchBar';
import { UserRole } from '@newsapp/shared';

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const modalState = useAppSelector((state) => state.ui.modal);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            <Typography variant="h6" noWrap>
              Dream News
            </Typography>
          </Link>

          {isHomePage && <SearchBar />}

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2">{user?.nickname ?? ''}</Typography>

            {isAuthenticated ? (
              <>
                <IconButton
                  size="large"
                  aria-label="account menu"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  color="inherit"
                >
                  <Avatar>{user?.nickname?.[0] ?? '?'}</Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  {user?.role === UserRole.ADMIN && (
                    <MenuItem onClick={() => setAnchorEl(null)}>
                      <Link href="/admin">Admin</Link>
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => setAnchorEl(null)}>
                    <Link href="/profile">Profile</Link>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <IconButton onClick={() => dispatch(openModal('login'))} size="large" color="inherit">
                <AccountCircle />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <LoginModal open={modalState.isOpen && modalState.type === 'login'} />
    </>
  );
}
