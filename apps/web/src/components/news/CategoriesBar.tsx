'use client';

import { Box, Chip, Container } from '@mui/material';
import { NEWS_CATEGORIES } from '@newsapp/shared';
import { useAppSelector } from '@/hooks/useAppDispatch';

interface CategoriesBarProps {
  onCategoryChange?: (category: string) => void;
}

export default function CategoriesBar({ onCategoryChange }: CategoriesBarProps) {
  const currentCategory = useAppSelector((state) => state.news.category);

  return (
    <Box
      sx={{ py: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            pb: 0.5,
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {NEWS_CATEGORIES.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.name}
              onClick={() => onCategoryChange?.(cat.type)}
              variant={currentCategory === cat.type ? 'filled' : 'outlined'}
              color={currentCategory === cat.type ? 'primary' : 'default'}
              sx={{ fontWeight: 600, flexShrink: 0 }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
