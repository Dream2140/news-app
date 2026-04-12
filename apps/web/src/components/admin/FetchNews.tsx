'use client';

import { Button, Box, Typography, CircularProgress, Chip } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchExternalNews } from '@/store/slices/adminSlice';
import { showSnackbar } from '@/store/slices/uiSlice';
import { useState } from 'react';

type FetchSource = 'cybersport' | 'currents' | 'all';

export default function FetchNews() {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.admin);
  const [fetchingSource, setFetchingSource] = useState<FetchSource | null>(null);

  const handleFetch = async (source: FetchSource) => {
    setFetchingSource(source);
    const result = await dispatch(fetchExternalNews(source));
    setFetchingSource(null);

    if (fetchExternalNews.fulfilled.match(result)) {
      dispatch(showSnackbar({ message: `News fetched from ${source}`, severity: 'success' }));
    } else {
      dispatch(showSnackbar({ message: `Failed to fetch from ${source}`, severity: 'error' }));
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', maxWidth: 400 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6">Fetch External News</Typography>
        <Chip label="Auto: every 10 min" size="small" color="success" variant="outlined" />
      </Box>

      <Button variant="contained" onClick={() => handleFetch('all')} disabled={isLoading}>
        {fetchingSource === 'all' ? <CircularProgress size={24} /> : 'Fetch All Sources'}
      </Button>
      <Button variant="outlined" onClick={() => handleFetch('cybersport')} disabled={isLoading}>
        {fetchingSource === 'cybersport' ? <CircularProgress size={24} /> : 'Fetch from Cybersport'}
      </Button>
      <Button variant="outlined" onClick={() => handleFetch('currents')} disabled={isLoading}>
        {fetchingSource === 'currents' ? <CircularProgress size={24} /> : 'Fetch from Currents API'}
      </Button>
    </Box>
  );
}
