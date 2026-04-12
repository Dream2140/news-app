'use client';

import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { createComment } from '@/store/slices/commentsSlice';

interface CommentFormProps {
  newsId: string;
}

export default function CommentForm({ newsId }: CommentFormProps) {
  const [content, setContent] = useState('');
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    dispatch(
      createComment({
        content: content.trim(),
        newsId,
        userId: user.id,
        nickname: user.nickname,
      }),
    );
    setContent('');
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
      />
      <Button type="submit" variant="contained" sx={{ mt: 1 }} disabled={!content.trim()}>
        Post Comment
      </Button>
    </Box>
  );
}
