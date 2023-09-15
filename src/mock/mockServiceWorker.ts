import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { AppRoute, BASE_URL } from '../constants';

import { mockArticlesResponse } from './mockArticles';

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
];

const server = setupServer(...handlers);
export { handlers, server };
