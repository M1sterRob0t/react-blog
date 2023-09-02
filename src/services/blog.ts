import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { TArticleResponse, TArticlesSuccessResponse } from '../types/articles';
import { POSTS_PER_PAGE } from '../constants';

enum Endpoint {
  Articles = 'articles',
  Users = 'users',
  Login = 'users/login',
  User = 'user',
}

// Define a service using a base URL and expected endpoints
export const blogApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://blog.kata.academy/api' }),
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
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetArticlesQuery, useGetArticleQuery } = blogApi;
