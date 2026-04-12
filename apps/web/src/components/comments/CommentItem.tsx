'use client';

import { useState } from 'react';
import {
  Avatar,
  Box,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { IComment } from '@newsapp/shared';

interface CommentItemProps {
  comment: IComment;
  canDelete: boolean;
  onDelete: (id: string) => void;
}

export default function CommentItem({ comment, canDelete, onDelete }: CommentItemProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 2,
          p: 2,
          bgcolor: 'action.hover',
          borderRadius: 2,
          transition: 'background-color 0.2s',
        }}
      >
        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: '0.875rem' }}>
          {comment.nickname?.[0]?.toUpperCase() ?? '?'}
        </Avatar>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="subtitle2">{comment.nickname}</Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(comment.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
            {comment.content}
          </Typography>
        </Box>
        {canDelete && (
          <IconButton
            onClick={() => setConfirmOpen(true)}
            size="small"
            sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete this comment?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            onClick={() => {
              onDelete(comment._id);
              setConfirmOpen(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
