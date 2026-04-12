'use client';

import { Button, Box, Typography, CircularProgress, Chip } from '@mui/material';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { apiClient } from '@/lib/api-client';
import { useState } from 'react';

type Source = 'cybersport' | 'currents' | 'all';

export default function FetchNews() {
  const { showSnackbar } = useSnackbar();
  const [fetching, setFetching] = useState<Source | null>(null);

  const handleFetch = async (source: Source) => {
    setFetching(source);
    try {
      const endpoints: Record<Source, string> = {
        cybersport: '/news/update-from-cybersport',
        currents: '/news/update-from-currents',
        all: '/news/fetch-all-sources',
      };
      await apiClient.get(endpoints[source]);
      showSnackbar(`News fetched from ${source}`, 'success');
    } catch {
      showSnackbar(`Failed to fetch from ${source}`, 'error');
    } finally {
      setFetching(null);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', maxWidth: 400 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6">Fetch External News</Typography>
        <Chip label="Auto: every 30 min" size="small" color="success" variant="outlined" />
      </Box>
      <Button variant="contained" onClick={() => handleFetch('all')} disabled={!!fetching}>
        {fetching === 'all' ? <CircularProgress size={24} /> : 'Fetch All Sources'}
      </Button>
      <Button variant="outlined" onClick={() => handleFetch('cybersport')} disabled={!!fetching}>
        {fetching === 'cybersport' ? <CircularProgress size={24} /> : 'Fetch from Cybersport'}
      </Button>
      <Button variant="outlined" onClick={() => handleFetch('currents')} disabled={!!fetching}>
        {fetching === 'currents' ? <CircularProgress size={24} /> : 'Fetch from Currents API'}
      </Button>
    </Box>
  );
}
