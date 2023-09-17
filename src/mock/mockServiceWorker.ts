import { rest } from 'msw';
import { setupServer } from 'msw/node';

import type { TUserEditRequest, TUserResponse } from '../types/users';
import type { TArticleResponse, TNewArticleRequest } from '../types/articles';
import { AppRoute, BASE_URL } from '../constants';

import { mockArticlesResponse } from './mockArticles';
import { mockUser } from './mockUser';

const handlers = [
  rest.get(`${BASE_URL}${AppRoute.Articles}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockArticlesResponse));
  }),
  rest.get(`${BASE_URL}${AppRoute.Article}`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ article: mockArticlesResponse.articles.find((el) => el.slug === req.params.slug) })
    );
  }),
  rest.post(`${BASE_URL}${AppRoute.Article}/favorite`, (req, res, ctx) => {
    const article = mockArticlesResponse.articles.find((el) => el.slug === req.params.slug)!;
    article.favorited = true;
    article.favoritesCount = ++article.favoritesCount;
    return res(ctx.status(200), ctx.json({ article: article }));
  }),
  rest.delete(`${BASE_URL}${AppRoute.Article}/favorite`, (req, res, ctx) => {
    const article = mockArticlesResponse.articles.find((el) => el.slug === req.params.slug)!;
    article.favorited = false;
    article.favoritesCount = --article.favoritesCount;
    return res(ctx.status(200), ctx.json({ article: article }));
  }),
  rest.delete(`${BASE_URL}${AppRoute.Article}`, (req, res, ctx) => {
    const updatedArticles = mockArticlesResponse.articles.filter((el) => el.slug !== req.params.slug)!;
    mockArticlesResponse.articles = updatedArticles;
    return res(ctx.status(201));
  }),
  rest.post(`${BASE_URL}${AppRoute.Articles}`, async (req, res, ctx) => {
    const newArticleRequest: TNewArticleRequest = await req.json();
    const newArticle = newArticleRequest.article;
    const newArticleResponse: TArticleResponse = {
      article: {
        slug: newArticle.title + 'q-heci7a',
        title: newArticle.title,
        description: newArticle.description,
        body: newArticle.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tagList: newArticle.tagList,
        favorited: false,
        favoritesCount: 0,
        author: {
          username: mockUser.username,
          image: mockUser.image || '',
          following: false,
        },
      },
    };
    mockArticlesResponse.articles.unshift(newArticleResponse.article);
    return res(ctx.status(200), ctx.json(mockArticlesResponse));
  }),
  rest.put(`${BASE_URL}${AppRoute.Article}`, async (req, res, ctx) => {
    const updatedArticleRequest: TNewArticleRequest = await req.json();
    const updatedArticle = updatedArticleRequest.article;
    const newArticleResponse: TArticleResponse = {
      article: {
        slug: req.params.slug as string,
        title: updatedArticle.title,
        description: updatedArticle.description,
        body: updatedArticle.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tagList: updatedArticle.tagList,
        favorited: false,
        favoritesCount: 0,
        author: {
          username: mockUser.username,
          image: mockUser.image || '',
          following: false,
        },
      },
    };
    const index = mockArticlesResponse.articles.findIndex((el) => el.slug === req.params.slug);
    mockArticlesResponse.articles = [
      ...mockArticlesResponse.articles.slice(0, index),
      newArticleResponse.article,
      ...mockArticlesResponse.articles.slice(index + 1),
    ];
    return res(ctx.status(200), ctx.json(newArticleResponse));
  }),
  rest.put(`${BASE_URL}/user`, async (req, res, ctx) => {
    const userEditRequest: TUserEditRequest = await req.json();
    const user = userEditRequest.user;
    const userResponse: TUserResponse = {
      user: {
        email: user.email || mockUser.email,
        token: mockUser.token,
        username: user.username || mockUser.username,
        bio: mockUser.bio,
        image: user.image || mockUser.username,
      },
    };

    return res(ctx.status(200), ctx.json(userResponse));
  }),
];

const server = setupServer(...handlers);
export { handlers, server };
