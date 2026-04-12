import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api-client';
import type { IComment } from '@newsapp/shared';

interface CommentsState {
  comments: IComment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  isLoading: false,
  error: null,
};

export const fetchComments = createAsyncThunk('comments/fetch', async (newsId: string) => {
  const response = await apiClient.get(`/comment/news-comments/${newsId}`);
  return response.data.data as IComment[];
});

export const createComment = createAsyncThunk(
  'comments/create',
  async (data: { content: string; newsId: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/comment', data);
      return response.data.data as IComment;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message ?? 'Failed to create comment');
    }
  },
);

export const deleteComment = createAsyncThunk(
  'comments/delete',
  async (commentId: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/comment/${commentId}`);
      return commentId;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message ?? 'Failed to delete comment');
    }
  },
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Failed to fetch comments';
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;
