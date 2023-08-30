import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { TNewUser } from '../types/users';
import type { TBlogState } from '../types/states';

import { fetchArticles, fetchArticle, postNewUser, requireLogin } from './api-actions';
import { getUserInfo, saveUserInfo, removeUserInfo } from './userInfo';

const initialState: TBlogState = {
  article: null,
  articles: [],
  isLoading: false,
  isError: false,
  user: getUserInfo(),
  error: null,
};

export const blogSlice = createSlice({
  name: 'blog',
  initialState,

  reducers: {
    clearErrorAction: (state: TBlogState) => {
      state.isError = false;
    },
    setErrorAction: (state: TBlogState, action: PayloadAction<TNewUser | null>) => {
      state.error = action.payload;
    },
    logoutAction: (state: TBlogState) => {
      state.user = null;
      removeUserInfo();
    },
  },

  extraReducers: (builder) => {
    builder // fetchArticles
      .addCase(fetchArticles.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articles = action.payload;
      })
      .addCase(fetchArticles.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      }) // fetchArticle
      .addCase(fetchArticle.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(fetchArticle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.article = action.payload;
      })
      .addCase(fetchArticle.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      }) // postNewUser
      .addCase(postNewUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postNewUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        saveUserInfo(action.payload);
      })
      .addCase(postNewUser.rejected, (state) => {
        state.isLoading = false;
      }) // requireLogin
      .addCase(requireLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(requireLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        saveUserInfo(action.payload);
      })
      .addCase(requireLogin.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearErrorAction, setErrorAction, logoutAction } = blogSlice.actions;
export default blogSlice.reducer;
