import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api-client';
import type { IComment } from '@newsapp/shared';

interface ProfileState {
  comments: IComment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  comments: [],
  isLoading: false,
  error: null,
};

export const fetchUserComments = createAsyncThunk(
  'profile/fetchComments',
  async (userId: string) => {
    const response = await apiClient.get(`/comment/user-comments/${userId}`);
    return response.data.data as IComment[];
  },
);

export const updateUserData = createAsyncThunk(
  'profile/updateUser',
  async (
    { userId, data }: { userId: string; data: { nickname?: string } },
    { rejectWithValue },
  ) => {
    try {
      const response = await apiClient.put(`/user/update-user/${userId}`, data);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message ?? 'Update failed');
    }
  },
);

export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async (
    {
      userId,
      currentPassword,
      newPassword,
    }: { userId: string; currentPassword: string; newPassword: string },
    { rejectWithValue },
  ) => {
    try {
      await apiClient.put(`/user/update-password/${userId}`, { currentPassword, newPassword });
      return 'Password updated successfully';
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message ?? 'Password change failed');
    }
  },
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload;
      })
      .addCase(fetchUserComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Failed to fetch comments';
      });
  },
});

export default profileSlice.reducer;
