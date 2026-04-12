'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { NEWS_CATEGORIES } from '@newsapp/shared';
import { apiClient } from '@/lib/api-client';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { showSnackbar } from '@/store/slices/uiSlice';

export default function AddNews() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('cybersport');
  const [image, setImage] = useState<File | null>(null);

  const categories = NEWS_CATEGORIES.filter((c) => c.type !== 'all');

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug) {
      setSlug(
        value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .slice(0, 80),
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('text', text);
      formData.append('slug', slug);
      formData.append('category', category);
      formData.append('publishedAt', String(Date.now()));
      if (image) {
        formData.append('image', image);
      }

      await apiClient.post('/news/post-news', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      dispatch(showSnackbar({ message: 'News created successfully!', severity: 'success' }));
      setTitle('');
      setText('');
      setSlug('');
      setCategory('cybersport');
      setImage(null);
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      setError(apiErr.response?.data?.message ?? 'Failed to create news');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AddIcon /> Create News
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          size="small"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
        />

        <TextField
          label="Slug"
          fullWidth
          margin="normal"
          size="small"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          helperText="URL-friendly name (auto-generated from title)"
        />

        <TextField
          label="Category"
          select
          fullWidth
          margin="normal"
          size="small"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.type}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Content"
          fullWidth
          multiline
          rows={8}
          margin="normal"
          size="small"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

        <Button variant="outlined" component="label" sx={{ mt: 1, mb: 1 }}>
          {image ? image.name : 'Upload Image'}
          <input
            type="file"
            hidden
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2, height: 44 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Publish'}
        </Button>
      </Box>
    </Box>
  );
}
