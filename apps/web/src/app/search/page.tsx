import { Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';
import SearchContent from './SearchContent';

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
