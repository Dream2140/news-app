'use client';

import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api-client';
import type { IComment } from '@newsapp/shared';

const MAX_COMMENT_LENGTH = 5000;

export default function CommentForm({
  newsId,
  onCreated,
}: {
  newsId: string;
  onCreated: (c: IComment) => void;
}) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsLoading(true);
    try {
      const res = await apiClient.post('/comment', { content: content.trim(), newsId });
      onCreated(res.data.data);
      setContent('');
    } catch {
      /* ignore */
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
      <TextField
        label="Write a comment..."
        multiline
        rows={3}
        fullWidth
        value={content}
        onChange={(e) => setContent(e.target.value)}
        slotProps={{ htmlInput: { maxLength: MAX_COMMENT_LENGTH } }}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 1 }}
        disabled={!content.trim() || isLoading}
      >
        {isLoading ? 'Posting...' : 'Post Comment'}
      </Button>
    </Box>
  );
}
