import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api-client';
import type { INews } from '@newsapp/shared';

interface NewsState {
  docs: INews[];
  category: string;
  searchQuery: string;
  totalDocs: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  docs: [],
  category: 'all',
  searchQuery: '',
  totalDocs: 0,
  totalPages: 0,
  page: 1,
  hasNextPage: false,
  isLoading: false,
  error: null,
};

export const fetchNews = createAsyncThunk(
  'news/fetch',
  async (params: { page: number; limit: number; category: string }) => {
    const response = await apiClient.get('/news/get-all-news', { params });
    return response.data.data;
  },
);

export const searchNews = createAsyncThunk('news/search', async (query: string) => {
  const response = await apiClient.get('/news/get-news-by-title', {
    params: { title: query },
  });
  return { docs: response.data.data as INews[], query };
});

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    changeCategory(state, action: PayloadAction<string>) {
      return { ...initialState, category: action.payload };
    },
    resetNews() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.docs =
          action.meta.arg.page === 1
            ? action.payload.docs
            : [...state.docs, ...action.payload.docs];
        state.totalDocs = action.payload.totalDocs;
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
        state.hasNextPage = action.payload.hasNextPage;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Failed to fetch news';
      })
      .addCase(searchNews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchNews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.docs = action.payload.docs;
        state.searchQuery = action.payload.query;
        state.hasNextPage = false;
      })
      .addCase(searchNews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Search failed';
      });
  },
});

export const { changeCategory, resetNews } = newsSlice.actions;
export default newsSlice.reducer;
