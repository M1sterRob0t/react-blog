import { createSlice } from '@reduxjs/toolkit';
import type { Action } from '@reduxjs/toolkit';

import type { TArticle } from '../../../types/articles';

import {
  fetchArticles,
  fetchArticle,
  postNewArticle,
  updateUserArticle,
  deleteUserArticle,
  postLikeToArticle,
  deleteLikeFromArticle,
} from './api-actions';

interface RejectedAction extends Action {
  isError: true;
}

function isArticleRejectedAction(action: Action): action is RejectedAction {
  return action.type.startsWith('articles') && action.type.endsWith('rejected') && !action.type.includes('Like');
}

interface PendingAction extends Action {
  isLoading: true;
}

function isArticlesPendingAction(action: Action): action is PendingAction {
  return action.type.startsWith('articles') && action.type.endsWith('pending') && !action.type.includes('Like');
}

/* function isLikesPendingAction(action: Action) {
  // : action is PendingAction
  return action.type.startsWith('articles') && action.type.endsWith('pending') && action.type.includes('Like');
} */

export type TArticlesState = {
  article: TArticle | null;
  articles: TArticle[];
  isLoading: boolean;
  isError: boolean;
  isUpdated: boolean;
  currentRequestId: string | null;
};

const initialState: TArticlesState = {
  article: null,
  articles: [],
  isLoading: false,
  isError: false,
  isUpdated: false,
  currentRequestId: null,
};

export const articlesSlice = createSlice({
  name: 'articles',
  initialState,

  reducers: {
    clearArticleAction: (state: TArticlesState) => {
      state.article = null;
    },
  },
  extraReducers: (builder) => {
    builder // fetchArticles
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articles = action.payload;
      }) // fetchArticle
      .addCase(fetchArticle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.article = action.payload;
      })
      .addCase(postNewArticle.fulfilled, (state, action) => {
        state.article = action.payload;
        state.isUpdated = true;
        state.isLoading = false;
      }) // editUserArticle
      .addCase(updateUserArticle.fulfilled, (state) => {
        state.isUpdated = true;
        state.isLoading = false;
      }) // deleteArticle
      .addCase(deleteUserArticle.fulfilled, (state) => {
        state.isUpdated = true;
        state.isLoading = false;
      }) // // postLikeToArticle
      .addCase(postLikeToArticle.pending, (state, action) => {
        if (!state.currentRequestId) {
          console.log('pending...');
          state.currentRequestId = action.meta.requestId;
        }
      })
      .addCase(postLikeToArticle.fulfilled, (state, action) => {
        const updatedArticle = action.payload;

        console.log('fulfilled');
        const index = state.articles.findIndex((article) => article.slug === updatedArticle.slug);
        state.articles = [...state.articles.slice(0, index), updatedArticle, ...state.articles.slice(index + 1)];
        state.article = updatedArticle;
        state.currentRequestId = null;
      })
      .addCase(postLikeToArticle.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (state.currentRequestId === requestId) {
          console.log('rejected');
          state.currentRequestId = null;
        }
      })
      // deleteLikeFromArticle
      .addCase(deleteLikeFromArticle.pending, (state, action) => {
        if (!state.currentRequestId) {
          console.log('pending...');
          state.currentRequestId = action.meta.requestId;
        }
      })
      .addCase(deleteLikeFromArticle.fulfilled, (state, action) => {
        const updatedArticle = action.payload;
        const index = state.articles.findIndex((article) => article.slug === updatedArticle.slug);
        state.articles = [...state.articles.slice(0, index), updatedArticle, ...state.articles.slice(index + 1)];
        state.article = action.payload;
        state.currentRequestId = null;
      })
      .addCase(deleteLikeFromArticle.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (state.currentRequestId === requestId) {
          console.log('rejected');
          state.currentRequestId = null;
        }
      })
      .addMatcher(isArticlesPendingAction, (state) => {
        state.isUpdated = false;
        state.isError = false;
        state.isLoading = true;
      })
      .addMatcher(isArticleRejectedAction, (state) => {
        state.isLoading = false;
        state.isError = true; // test, remove if not good
      });
  },
});

export const { clearArticleAction } = articlesSlice.actions;
export default articlesSlice.reducer;
