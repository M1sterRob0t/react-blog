import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { TNewUser } from '../types/users';
import type { TBlogState } from '../types/states';

import {
  fetchArticles,
  fetchArticle,
  postNewUser,
  requireLogin,
  postUpdatedUser,
  postNewArticle,
  updateUserArticle,
  deleteUserArticle,
  postLikeToArticle,
  deleteLikeFromArticle,
} from './api-actions';
import { getUserInfo, saveUserInfo, removeUserInfo } from './userInfo';

const initialState: TBlogState = {
  article: null,
  articles: [],
  isLoading: false,
  isError: false,
  isUpdated: false,
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
    clearUpdatedStatusAction: (state: TBlogState) => {
      state.isUpdated = false;
    },
    clearArticleAction: (state: TBlogState) => {
      state.article = null;
    },
  },

  extraReducers: (builder) => {
    builder // fetchArticles
      .addCase(fetchArticles.pending, (state) => {
        state.isError = false;
        state.isUpdated = false;
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
        state.isUpdated = false;
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
      }) // postUpdatedUser
      .addCase(postUpdatedUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postUpdatedUser.fulfilled, (state, action) => {
        state.isUpdated = true;
        state.isLoading = false;
        state.user = action.payload;
        saveUserInfo(action.payload);
      })
      .addCase(postUpdatedUser.rejected, (state) => {
        state.isUpdated = false;
        state.isLoading = false;
      }) // postNewArticle
      .addCase(postNewArticle.pending, (state) => {
        state.isUpdated = false;
        state.isLoading = true;
      })
      .addCase(postNewArticle.fulfilled, (state, action) => {
        state.article = action.payload;
        state.isUpdated = true;
        state.isLoading = false;
      })
      .addCase(postNewArticle.rejected, (state) => {
        state.isLoading = false;
      }) // editUserArticle
      .addCase(updateUserArticle.pending, (state) => {
        state.isUpdated = false;
        state.isLoading = true;
      })
      .addCase(updateUserArticle.fulfilled, (state) => {
        state.isUpdated = true;
        state.isLoading = false;
      })
      .addCase(updateUserArticle.rejected, (state) => {
        state.isUpdated = false;
        state.isLoading = false;
      }) // deleteUserArticle
      .addCase(deleteUserArticle.pending, (state) => {
        state.isUpdated = false;
        state.isLoading = true;
      })
      .addCase(deleteUserArticle.fulfilled, (state) => {
        state.isUpdated = true;
        state.isLoading = false;
      })
      .addCase(deleteUserArticle.rejected, (state) => {
        state.isUpdated = false;
        state.isLoading = false;
      }) // postLikeToArticle
      .addCase(postLikeToArticle.pending, (state) => {
        state.isError = false;
      })
      .addCase(postLikeToArticle.fulfilled, (state, action) => {
        const updatedArticle = action.payload;
        const index = state.articles.findIndex((article) => article.slug === updatedArticle.slug);
        state.articles = [...state.articles.slice(0, index), updatedArticle, ...state.articles.slice(index + 1)];
        state.article = action.payload;
      })
      .addCase(postLikeToArticle.rejected, (state) => {
        state.isError = true;
      }) // deleteLikeFromArticle
      .addCase(deleteLikeFromArticle.pending, (state) => {
        state.isError = false;
      })
      .addCase(deleteLikeFromArticle.fulfilled, (state, action) => {
        const updatedArticle = action.payload;
        const index = state.articles.findIndex((article) => article.slug === updatedArticle.slug);
        state.articles = [...state.articles.slice(0, index), updatedArticle, ...state.articles.slice(index + 1)];
        state.article = action.payload;
      })
      .addCase(deleteLikeFromArticle.rejected, (state) => {
        state.isError = true;
      });
  },
});

export const { clearErrorAction, setErrorAction, logoutAction, clearUpdatedStatusAction, clearArticleAction } =
  blogSlice.actions;
export default blogSlice.reducer;
