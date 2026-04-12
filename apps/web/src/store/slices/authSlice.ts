import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api-client';
import type { IUserDto } from '@newsapp/shared';

interface AuthState {
  user: IUserDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (form: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/user/login', form);
      return response.data.data.user as IUserDto;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message ?? 'Login failed');
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (form: { nickname: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/user/register', form);
      return response.data.data.user as IUserDto;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message ?? 'Registration failed');
    }
  },
);

export const refreshAuth = createAsyncThunk('auth/refresh', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get('/user/refresh');
    return response.data.data.user as IUserDto;
  } catch {
    return rejectWithValue('Session expired');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      apiClient.post('/user/logout').catch(() => {});
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(refreshAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(refreshAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
