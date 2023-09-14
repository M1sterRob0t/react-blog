import { rest } from 'msw';

import { AppRoute, BASE_URL } from '../constants';

import { getMockArticles } from './getMockArticles';

const mockArticles = getMockArticles();
const handlers = [
  rest.get(`${BASE_URL}${AppRoute.Articles}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockArticles));
  }),
  rest.get(`${BASE_URL}${AppRoute.Article}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ article: mockArticles.articles.find((el) => el.slug === req.params.slug) }));
  }),
];

export { handlers };
