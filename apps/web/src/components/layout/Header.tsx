'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  InputBase,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { logout } from '@/store/slices/authSlice';
import { openModal } from '@/store/slices/uiSlice';
import { useThemeMode } from '@/theme/ThemeProvider';
import LoginModal from '@/components/auth/LoginModal';
import { UserRole } from '@newsapp/shared';

export default function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, toggleTheme } = useThemeMode();

  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const modalState = useAppSelector((state) => state.ui.modal);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="fixed" elevation={0}>
        <Toolbar sx={{ gap: 1 }}>
          {isMobile && (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)} edge="start">
              <MenuIcon />
            </IconButton>
          )}

          <Link
            href="/"
            style={{
              color: 'inherit',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <NewspaperIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" noWrap sx={{ fontWeight: 800 }}>
              Dream
              <Box component="span" sx={{ color: 'primary.main' }}>
                News
              </Box>
            </Typography>
          </Link>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5, ml: 3 }}>
              {['All', 'Cybersport', 'Technology', 'Politic'].map((cat) => (
                <Link
                  key={cat}
                  href={cat === 'All' ? '/' : `/?category=${cat.toLowerCase()}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      '&:hover': { color: 'primary.main', bgcolor: 'rgba(233,69,96,0.08)' },
                      transition: 'all 0.2s',
                    }}
                  >
                    {cat}
                  </Typography>
                </Link>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {searchOpen ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'background.paper',
                borderRadius: 2,
                px: 1.5,
                border: '1px solid',
                borderColor: 'primary.main',
              }}
            >
              <InputBase
                autoFocus
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                onBlur={() => !searchQuery && setSearchOpen(false)}
                sx={{ color: 'text.primary', width: 200 }}
              />
              <IconButton size="small" onClick={handleSearch} color="primary">
                <SearchIcon />
              </IconButton>
            </Box>
          ) : (
            <IconButton color="inherit" onClick={() => setSearchOpen(true)}>
              <SearchIcon />
            </IconButton>
          )}

          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {isAuthenticated ? (
            <>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} color="inherit">
                <Avatar
                  sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}
                >
                  {user?.nickname?.[0]?.toUpperCase() ?? '?'}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <MenuItem disabled sx={{ opacity: '1 !important' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {user?.nickname}
                  </Typography>
                </MenuItem>
                <Divider />
                {user?.role === UserRole.ADMIN && (
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      router.push('/admin');
                    }}
                  >
                    Admin Panel
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    router.push('/profile');
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <IconButton onClick={() => dispatch(openModal('login'))} color="inherit">
              <AccountCircle />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, pt: 2 }}>
          <Typography variant="h6" sx={{ px: 2, mb: 2, fontWeight: 800 }}>
            Dream
            <Box component="span" sx={{ color: 'primary.main' }}>
              News
            </Box>
          </Typography>
          <List>
            {['All', 'Cybersport', 'Technology', 'Politic', 'Entertainment', 'Health'].map(
              (cat) => (
                <ListItemButton
                  key={cat}
                  onClick={() => {
                    router.push(cat === 'All' ? '/' : `/?category=${cat.toLowerCase()}`);
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemText primary={cat} />
                </ListItemButton>
              ),
            )}
          </List>
        </Box>
      </Drawer>

      <LoginModal open={modalState.isOpen && modalState.type === 'login'} />
    </>
  );
}
