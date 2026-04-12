'use client';

import { useState } from 'react';
import { InputBase, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { searchNews } from '@/store/slices/newsSlice';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const dispatch = useAppDispatch();

  const handleSearch = () => {
    if (query.trim()) {
      dispatch(searchNews(query.trim()));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        ml: 2,
        bgcolor: 'rgba(255,255,255,0.15)',
        borderRadius: 1,
        px: 1,
      }}
    >
      <InputBase
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{ color: 'inherit', ml: 1 }}
      />
      <IconButton onClick={handleSearch} color="inherit" size="small">
        <SearchIcon />
      </IconButton>
    </Box>
  );
}
