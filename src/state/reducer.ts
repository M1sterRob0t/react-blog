import { createSlice } from '@reduxjs/toolkit';

import { TBlogState } from '../types/states';

import { fetchArticles, fetchArticle } from './api-actions';

const initialState: TBlogState = {
  article: null,
  articles: [],
  isLoading: false,
  isError: false,
};

export const blogSlice = createSlice({
  name: 'blog',
  initialState,

  reducers: {
    clearError: (state: TBlogState) => {
      state.isError = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articles = action.payload;
      })
      .addCase(fetchArticles.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(fetchArticle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchArticle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.article = action.payload;
      })
      .addCase(fetchArticle.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { clearError } = blogSlice.actions;
export default blogSlice.reducer;
