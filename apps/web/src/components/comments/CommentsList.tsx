'use client';

import { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
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
      <Typography variant="h6" gutterBottom>
        Comments ({comments.length})
      </Typography>

      <CommentForm newsId={newsId} />

      {isLoading ? (
        <CircularProgress />
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
