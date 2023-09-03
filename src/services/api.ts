import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { TArticleResponse, TArticlesSuccessResponse } from '../types/articles';
import { POSTS_PER_PAGE } from '../constants';
import { TNewUserRequest, TUserResponse, TUserLoginRequest, TUserEditRequest, TUserInfo } from '../types/users';

enum Endpoint {
  Articles = 'articles',
  Users = 'users',
  Login = 'users/login',
  User = 'user',
}

type TState = {
  userInfo: {
    user: TUserInfo;
  };
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://blog.kata.academy/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as TState).userInfo.user.token;

      // If we have a token set in state, let's assume that we should be passing it.
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
