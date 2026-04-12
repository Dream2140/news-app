import { Avatar, Box, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { IComment } from '@newsapp/shared';

interface CommentItemProps {
  comment: IComment;
  canDelete: boolean;
  onDelete: (id: string) => void;
}

export default function CommentItem({ comment, canDelete, onDelete }: CommentItemProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
      <Avatar>{comment.nickname?.[0] ?? '?'}</Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{comment.nickname}</Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date(comment.publishedAt).toLocaleDateString()}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {comment.content}
        </Typography>
      </Box>
      {canDelete && (
        <IconButton onClick={() => onDelete(comment._id)} size="small">
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
}
