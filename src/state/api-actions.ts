import { createAsyncThunk } from '@reduxjs/toolkit';

import { TArticle, TArticlesResponse, TArticleResponse } from '../types/articles';
import { POSTS_PER_PAGE } from '../constants';
import { TNewUser, TNewUserResponse } from '../types/users';
const BASE_URL = 'https://blog.kata.academy/api';
enum Endpoint {
  Articles = '/articles',
  Users = '/users',
}

function formatArticles(articles: TArticle[]): TArticle[] {
  const articlesWithFilteredTags: TArticle[] = articles.map((article: TArticle) => {
    const tagsSet = new Set(article.tagList);
    const filteredTags = Array.from(tagsSet.keys()).filter((tag) => typeof tag === 'string');
    return { ...article, tagList: filteredTags };
  });

  return articlesWithFilteredTags;
}

export const fetchArticles = createAsyncThunk('blog/fetchArticles', async (page: number) => {
  const offset = page === 1 ? 0 : page * POSTS_PER_PAGE - POSTS_PER_PAGE;

  const response = await fetch(`${BASE_URL}${Endpoint.Articles}?offset=${offset}&limit=${POSTS_PER_PAGE}`);
  const data: TArticlesResponse = await response.json();
  const articles: TArticle[] = formatArticles(data.articles);

  return articles;
});

export const fetchArticle = createAsyncThunk('blog/fetchArticle', async (name: string) => {
  const response = await fetch(`${BASE_URL}${Endpoint.Articles}/${name}`);
  const data: TArticleResponse = await response.json();
  const article: TArticle = formatArticles([data.article])[0];

  return article;
});

export const postNewUser = createAsyncThunk('blog/postNewUser', async (newUser: TNewUser) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(newUser),
  };

  const response = await fetch(`${BASE_URL}${Endpoint.Users}`, options);
  const data: TNewUserResponse = await response.json();

  return data.user;
});
