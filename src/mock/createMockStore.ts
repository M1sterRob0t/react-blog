import { configureStore } from '@reduxjs/toolkit';

import { api } from '../services/api';
import userInfo from '../state/userReducer';

export function createMockStore() {
  const store = configureStore({
    reducer: {
      userInfo,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  });

  return store;
}
