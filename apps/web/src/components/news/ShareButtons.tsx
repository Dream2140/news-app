'use client';

import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import TelegramIcon from '@mui/icons-material/Telegram';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { showSnackbar } from '@/store/slices/uiSlice';

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const dispatch = useAppDispatch();

  const getUrl = () => (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      dispatch(showSnackbar({ message: 'Link copied!', severity: 'success' }));
    } catch {
      dispatch(showSnackbar({ message: 'Failed to copy', severity: 'error' }));
    }
  };

  const shareTwitter = () => {
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(getUrl())}`,
      '_blank',
    );
  };

  const shareTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(getUrl())}&text=${encodeURIComponent(title)}`,
      '_blank',
    );
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`,
      '_blank',
    );
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mr: 1, fontWeight: 600 }}>
        Share:
      </Typography>
      <Tooltip title="Copy link">
        <IconButton
          size="small"
          onClick={handleCopyLink}
          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
        >
          <LinkIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Share on X">
        <IconButton
          size="small"
          onClick={shareTwitter}
          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
        >
          <XIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Share on Telegram">
        <IconButton
          size="small"
          onClick={shareTelegram}
          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
        >
          <TelegramIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Share on Facebook">
        <IconButton
          size="small"
          onClick={shareFacebook}
          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
        >
          <FacebookIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
