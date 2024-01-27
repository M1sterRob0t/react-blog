import type { RootState } from './store';

export const selectArticles = (state: RootState) => state.articles.articles;
export const selectArticle = (state: RootState) => state.articles.article;
export const selectArticlesLoadingStatus = (state: RootState) => state.articles.isLoading;
export const selectArticlesErrorStatus = (state: RootState) => state.articles.isError;
export const selectArticlesUpdateStatus = (state: RootState) => state.articles.isUpdated;

export const selectUser = (state: RootState) => state.user.user;
export const selectUserServerError = (state: RootState) => state.user.serverError;
export const selectUserLoadingStatus = (state: RootState) => state.user.isLoading;
export const selectUserErrorStatus = (state: RootState) => state.user.isError;
export const selectUserUpdateStatus = (state: RootState) => state.user.isUpdated;
