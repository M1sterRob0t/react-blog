import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { TArticleResponse, TArticlesSuccessResponse, TNewArticleRequest } from '../types/articles';
import { BASE_URL, POSTS_PER_PAGE } from '../constants';
import { TNewUserRequest, TUserResponse, TUserLoginRequest, TUserEditRequest } from '../types/users';
import type { TRootState } from '../state/store';

enum Endpoint {
  Articles = 'articles',
  Users = 'users',
  Login = 'users/login',
  User = 'user',
}

export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['Articles', 'Article'],
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const user = (getState() as TRootState).userInfo.user;
      const token = user ? user.token : '';

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getArticles: builder.query<TArticlesSuccessResponse, number>({
      query: (page) => {
        const offset = page === 1 ? 0 : page * POSTS_PER_PAGE - POSTS_PER_PAGE;
        return `${Endpoint.Articles}?offset=${offset}&limit=${POSTS_PER_PAGE}`;
      },
      providesTags: (result) =>
        result
          ? [...result.articles.map(({ slug }) => ({ type: 'Articles' as const, id: slug })), 'Articles']
          : ['Articles'],
    }),
    getArticle: builder.query<TArticleResponse, string>({
      query: (slug) => `${Endpoint.Articles}/${slug}`,
      providesTags: (result) =>
        result ? [{ type: 'Articles' as const, id: result.article.slug }, 'Article'] : ['Article'],
    }),
    postLikeToArticle: builder.mutation<TArticleResponse, string>({
      query: (slug) => ({
        url: `${Endpoint.Articles}/${slug}/favorite`,
        method: 'POST',
        body: slug,
      }),
      invalidatesTags: ['Article', 'Articles'],
    }),
    deleteLikeFromArticle: builder.mutation<TArticleResponse, string>({
      query: (slug) => ({
        url: `${Endpoint.Articles}/${slug}/favorite`,
        method: 'DELETE',
        body: slug,
      }),
      invalidatesTags: ['Article', 'Articles'],
    }),
    deleteArticle: builder.mutation<void, string>({
      query: (slug) => ({
        url: `${Endpoint.Articles}/${slug}`,
        method: 'DELETE',
        body: slug,
      }),
      invalidatesTags: ['Articles'],
    }),
    postNewArticle: builder.mutation<TArticleResponse, TNewArticleRequest>({
      query: (article) => ({
        url: Endpoint.Articles,
        method: 'POST',
        body: article,
      }),
      invalidatesTags: ['Articles'],
    }),
    putUpdatedArticle: builder.mutation<TArticleResponse, { slug: string; article: TNewArticleRequest }>({
      query: ({ slug, article }) => ({
        url: `${Endpoint.Articles}/${slug}`,
        method: 'PUT',
        body: article,
      }),
      invalidatesTags: ['Articles'],
    }),
    postNewUser: builder.mutation<TUserResponse, TNewUserRequest>({
      query: (newUser) => ({
        url: Endpoint.Users,
        method: 'POST',
        body: newUser,
      }),
    }),
    postExistingUser: builder.mutation<TUserResponse, TUserLoginRequest>({
      query: (user) => ({
        url: Endpoint.Login,
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['Articles', 'Article'],
    }),
    putUpdatedUser: builder.mutation<TUserResponse, TUserEditRequest>({
      query: (user) => ({
        url: Endpoint.User,
        method: 'PUT',
        body: user,
      }),
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  usePostNewUserMutation,
  usePostExistingUserMutation,
  usePutUpdatedUserMutation,
  usePostNewArticleMutation,
  usePutUpdatedArticleMutation,
  useDeleteArticleMutation,
  usePostLikeToArticleMutation,
  useDeleteLikeFromArticleMutation,
} = api;
