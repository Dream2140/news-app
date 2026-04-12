'use client';

import { Button, Box, Typography, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchExternalNews } from '@/store/slices/adminSlice';
import { showSnackbar } from '@/store/slices/uiSlice';
import { useState } from 'react';

export default function FetchNews() {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.admin);
  const [fetching, setFetching] = useState<string | null>(null);

  const handleFetch = async (source: 'cybersport' | 'guardian') => {
    setFetching(source);
    const result = await dispatch(fetchExternalNews(source));
    setFetching(null);

    if (fetchExternalNews.fulfilled.match(result)) {
      dispatch(showSnackbar({ message: `News fetched from ${source}`, severity: 'success' }));
    } else {
      dispatch(showSnackbar({ message: `Failed to fetch from ${source}`, severity: 'error' }));
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', maxWidth: 400 }}>
      <Typography variant="h6">Fetch External News</Typography>
      <Button variant="contained" onClick={() => handleFetch('cybersport')} disabled={isLoading}>
        {fetching === 'cybersport' ? <CircularProgress size={24} /> : 'Fetch from Cybersport'}
      </Button>
      <Button variant="contained" onClick={() => handleFetch('guardian')} disabled={isLoading}>
        {fetching === 'guardian' ? <CircularProgress size={24} /> : 'Fetch from Guardian'}
      </Button>
    </Box>
  );
}
