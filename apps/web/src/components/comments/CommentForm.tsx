'use client';

import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { createComment } from '@/store/slices/commentsSlice';

const MAX_COMMENT_LENGTH = 5000;

interface CommentFormProps {
  newsId: string;
}

export default function CommentForm({ newsId }: CommentFormProps) {
  const [content, setContent] = useState('');
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content.length > MAX_COMMENT_LENGTH) return;

    dispatch(createComment({ content: content.trim(), newsId }));
    setContent('');
  };

  if (!isAuthenticated) return null;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }} aria-label="Post a comment">
      <TextField
        label="Write a comment..."
        multiline
        rows={3}
        fullWidth
        value={content}
        onChange={(e) => setContent(e.target.value)}
        slotProps={{ htmlInput: { maxLength: MAX_COMMENT_LENGTH } }}
      />
      <Button type="submit" variant="contained" sx={{ mt: 1 }} disabled={!content.trim()}>
        Post Comment
      </Button>
    </Box>
  );
}
