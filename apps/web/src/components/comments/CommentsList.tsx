'use client';

import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api-client';
import type { IComment } from '@newsapp/shared';

export default function CommentsList({ newsId }: { newsId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get(`/comment/news-comments/${newsId}`)
      .then((res) => setComments(res.data.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [newsId]);

  const handleCreated = (comment: IComment) => setComments((prev) => [comment, ...prev]);

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/comment/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch {
      /* ignore */
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CommentIcon /> Comments ({comments.length})
      </Typography>
      <CommentForm newsId={newsId} onCreated={handleCreated} />
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={32} />
        </Box>
      ) : comments.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6, bgcolor: 'action.hover', borderRadius: 2 }}>
          <CommentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography color="text.secondary">
            No comments yet. Be the first to share your thoughts!
          </Typography>
        </Box>
      ) : (
        comments.map((c) => (
          <CommentItem
            key={c._id}
            comment={c}
            canDelete={c.user === user?.id}
            onDelete={handleDelete}
          />
        ))
      )}
    </Box>
  );
}
