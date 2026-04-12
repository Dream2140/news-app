'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogActions,
  Collapse,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { NEWS_CATEGORIES, type INews } from '@newsapp/shared';
import { apiClient } from '@/lib/api-client';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { showSnackbar } from '@/store/slices/uiSlice';

const categories = NEWS_CATEGORIES.filter((c) => c.type !== 'all');

export default function AddNews() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('cybersport');
  const [image, setImage] = useState<File | null>(null);

  const [newsList, setNewsList] = useState<INews[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);

  const fetchNewsList = useCallback(async () => {
    setNewsLoading(true);
    try {
      const res = await apiClient.get('/news/get-all-news?limit=50&category=all');
      setNewsList(res.data.data.docs ?? []);
    } catch {
      /* ignore */
    } finally {
      setNewsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewsList();
  }, [fetchNewsList]);

  const resetForm = () => {
    setTitle('');
    setText('');
    setSlug('');
    setCategory('cybersport');
    setImage(null);
    setEditingId(null);
    setError('');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!editingId && !slug) {
      setSlug(
        value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .slice(0, 80),
      );
    }
  };

  const startEdit = (item: INews) => {
    setEditingId(item._id);
    setTitle(item.title);
    setText(item.text);
    setSlug(item.slug);
    setCategory(item.category);
    setImage(null);
    setFormOpen(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (editingId) {
        await apiClient.put(`/news/update-news/${editingId}`, {
          title,
          text,
          slug,
          category,
        });
        dispatch(showSnackbar({ message: 'News updated!', severity: 'success' }));
      } else {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('text', text);
        formData.append('slug', slug);
        formData.append('category', category);
        formData.append('publishedAt', String(Date.now()));
        if (image) formData.append('image', image);

        await apiClient.post('/news/post-news', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        dispatch(showSnackbar({ message: 'News created!', severity: 'success' }));
      }

      resetForm();
      setFormOpen(false);
      fetchNewsList();
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      setError(apiErr.response?.data?.message ?? 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/news/delete-news/${id}`);
      dispatch(showSnackbar({ message: 'News deleted', severity: 'success' }));
      setNewsList((prev) => prev.filter((n) => n._id !== id));
    } catch {
      dispatch(showSnackbar({ message: 'Failed to delete', severity: 'error' }));
    }
    setDeleteConfirm(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">News Management</Typography>
        <Button
          variant="contained"
          startIcon={formOpen ? <CloseIcon /> : <AddIcon />}
          onClick={() => {
            if (formOpen) {
              resetForm();
              setFormOpen(false);
            } else {
              resetForm();
              setFormOpen(true);
            }
          }}
          size="small"
        >
          {formOpen ? 'Cancel' : 'Create News'}
        </Button>
      </Box>

      <Collapse in={formOpen}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            {editingId ? 'Edit News' : 'New Article'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
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
              helperText="URL-friendly name"
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
              rows={6}
              margin="normal"
              size="small"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />

            {!editingId && (
              <Button variant="outlined" component="label" size="small" sx={{ mt: 1 }}>
                {image ? image.name : 'Upload Image'}
                <input
                  type="file"
                  hidden
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                />
              </Button>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, height: 40 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : editingId ? (
                'Save Changes'
              ) : (
                'Publish'
              )}
            </Button>
          </Box>
        </Paper>
      </Collapse>

      {newsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {newsList.map((item) => (
                <TableRow key={item._id} hover>
                  <TableCell
                    sx={{
                      maxWidth: 300,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.title}
                  </TableCell>
                  <TableCell>
                    <Chip label={item.category} size="small" sx={{ textTransform: 'capitalize' }} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.source || 'manual'}
                      size="small"
                      variant="outlined"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <IconButton size="small" onClick={() => startEdit(item)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setDeleteConfirm(item._id)}
                      sx={{ '&:hover': { color: 'error.main' } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Delete this article?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button color="error" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
