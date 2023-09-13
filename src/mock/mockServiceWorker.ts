import { rest } from 'msw';

import { getMockArticles } from './getMockArticles';

const handlers = [
  // Определите обработчики запросов и соответствующие фиктивные ответы здесь
  rest.get('https://blog.kata.academy/api/articles', (req, res, ctx) => {
    // Вернуть фиктивные данные, какие вам нужны
    return res(ctx.status(200), ctx.json(getMockArticles()));
  }),
];

export { handlers };
