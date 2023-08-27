import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { TArticle } from '../types/articles';
import { TBlogState } from '../types/states';

import { fetchArticles, fetchArticle } from './api-actions';

const initialState: TBlogState = {
  article: null,
  articles: [],
  status: 'idle',
};

export const blogSlice = createSlice({
  name: 'blog',
  initialState,

  reducers: {
    setArticles: (state: TBlogState, action: PayloadAction<TArticle[]>) => {
      state.articles = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = 'idle';
        state.articles = action.payload;
      })
      .addCase(fetchArticles.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchArticle.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchArticle.fulfilled, (state, action) => {
        state.status = 'idle';
        state.article = action.payload;
      })
      .addCase(fetchArticle.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { setArticles } = blogSlice.actions;
export default blogSlice.reducer;
