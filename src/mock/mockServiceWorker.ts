import { rest } from 'msw';
import { setupServer } from 'msw/node';

import type { TNewUserRequest, TUserEditRequest, TUserLoginRequest, TUserResponse } from '../types/users';
import type { TArticleResponse, TNewArticleRequest } from '../types/articles';
import { AppRoute, BASE_URL, Endpoint } from '../constants';

import { mockArticlesResponse } from './mockArticles';
import { mockTakenUsername, mockUser, mockUserPassword } from './mockUser';

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
  rest.put(`${BASE_URL}/${Endpoint.User}`, async (req, res, ctx) => {
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
    if (user.username === mockTakenUsername) {
      return res(ctx.status(422), ctx.json({ errors: { username: 'is already taken.' } }));
    }

    return res(ctx.status(200), ctx.json(userResponse));
  }),
  rest.post(`${BASE_URL}/${Endpoint.Login}`, async (req, res, ctx) => {
    const userLoginRequest: TUserLoginRequest = await req.json();
    const user = userLoginRequest.user;

    if (user.email === mockUser.email && user.password === mockUserPassword) {
      return res(ctx.status(200), ctx.json(mockUser));
    }

    return res(ctx.status(422), ctx.json({ message: 'Email or password is incorrect.' }));
  }),
  rest.post(`${BASE_URL}/${Endpoint.Users}`, async (req, res, ctx) => {
    const newUserRequest: TNewUserRequest = await req.json();
    const user = newUserRequest.user;
    const userResponse: TUserResponse = {
      user: {
        email: user.email,
        token: 'Basic aj@kd1#2!3as@d0adjashalb=312=020k-09-3423984=-asd',
        username: user.username,
        bio: '',
        image: null,
      },
    };
    if (user.username === mockUser.username) {
      return res(ctx.status(422), ctx.json({ errors: { username: 'is already taken.' } }));
    } else if (user.email === mockUser.email) {
      return res(ctx.status(422), ctx.json({ errors: { email: 'is already taken.' } }));
    }
    return res(ctx.status(200), ctx.json(userResponse));
  }),
];

const server = setupServer(...handlers);
export { handlers, server };
