import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { TArticleResponse, TArticlesSuccessResponse } from '../types/articles';
import { POSTS_PER_PAGE } from '../constants';
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
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://blog.kata.academy/api',
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
    }),
    getArticle: builder.query<TArticleResponse, string>({
      query: (slug) => `${Endpoint.Articles}/${slug}`,
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
} = api;
