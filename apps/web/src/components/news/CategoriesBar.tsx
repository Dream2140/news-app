'use client';

import { List, ListItemButton, ListItemText, Box } from '@mui/material';
import { NEWS_CATEGORIES } from '@newsapp/shared';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { changeCategory } from '@/store/slices/newsSlice';

export default function CategoriesBar() {
  const dispatch = useAppDispatch();
  const currentCategory = useAppSelector((state) => state.news.category);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
      <List sx={{ display: 'flex', flexDirection: 'row' }}>
        {NEWS_CATEGORIES.map((cat) => (
          <ListItemButton
            key={cat.id}
            selected={currentCategory === cat.type}
            onClick={() => dispatch(changeCategory(cat.type))}
          >
            <ListItemText primary={cat.name} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
