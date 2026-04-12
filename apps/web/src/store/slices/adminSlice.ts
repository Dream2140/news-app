import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api-client';
import type { IUserDto } from '@newsapp/shared';

interface AdminState {
  users: IUserDto[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  users: [],
  isLoading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async () => {
  const response = await apiClient.get('/user/all-users');
  return response.data.data as IUserDto[];
});

export const deleteUser = createAsyncThunk('admin/deleteUser', async (userId: string) => {
  await apiClient.delete(`/user/delete-user/${userId}`);
  return userId;
});

export const fetchExternalNews = createAsyncThunk(
  'admin/fetchExternal',
  async (source: 'cybersport' | 'guardian') => {
    const endpoint =
      source === 'cybersport' ? '/news/update-from-cybersport' : '/news/update-from-guardian';
    const response = await apiClient.get(endpoint);
    return response.data.data;
  },
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Failed to fetch users';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});

export default adminSlice.reducer;
