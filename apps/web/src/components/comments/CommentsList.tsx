'use client';

import { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchComments, deleteComment, clearComments } from '@/store/slices/commentsSlice';

interface CommentsListProps {
  newsId: string;
}

export default function CommentsList({ newsId }: CommentsListProps) {
  const dispatch = useAppDispatch();
  const { comments, isLoading } = useAppSelector((state) => state.comments);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchComments(newsId));
    return () => {
      dispatch(clearComments());
    };
  }, [dispatch, newsId]);

  const handleDelete = (commentId: string) => {
    dispatch(deleteComment(commentId));
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CommentIcon /> Comments ({comments.length})
      </Typography>

      <CommentForm newsId={newsId} />

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
        comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            canDelete={comment.user === user?.id}
            onDelete={handleDelete}
          />
        ))
      )}
    </Box>
  );
}
