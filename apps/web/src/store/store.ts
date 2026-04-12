import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import newsReducer from './slices/newsSlice';
import commentsReducer from './slices/commentsSlice';
import profileReducer from './slices/profileSlice';
import adminReducer from './slices/adminSlice';
import uiReducer from './slices/uiSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      news: newsReducer,
      comments: commentsReducer,
      profile: profileReducer,
      admin: adminReducer,
      ui: uiReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
