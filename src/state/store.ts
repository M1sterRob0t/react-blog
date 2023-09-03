import { configureStore } from '@reduxjs/toolkit';

import { api } from '../services/api';

import userInfo from './userReducer';

export const store = configureStore({
  reducer: {
    userInfo,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});
