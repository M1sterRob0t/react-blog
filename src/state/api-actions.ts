import { createAsyncThunk } from '@reduxjs/toolkit';

import { TArticle, TArticlesServerResponse, TArticleServerResponse } from '../types/articles';
import { POSTS_PER_PAGE, APIRoute } from '../constants';

const BASE_URL = 'https://blog.kata.academy/api';

function formatArticles(articles: TArticle[]): TArticle[] {
  const articlesWithFilteredTags: TArticle[] = articles.map((article: TArticle) => {
    const tagsSet = new Set(article.tagList);
    const filteredTags = Array.from(tagsSet.keys()).filter((tag) => typeof tag === 'string');
    return { ...article, tagList: filteredTags };
  });

  return articlesWithFilteredTags;
}

/* async function getResponse<T>(response: Response): Promise<T> {
  if (response.status !== 200) {
    const error = await response.json();
    throw new Error(`${response.status} ${error.status_message}`);
  }

  return await response.json();
} */

export const fetchArticles = createAsyncThunk('blog/fetchArticles', async (page: number) => {
  const offset = page === 1 ? 0 : page * POSTS_PER_PAGE - POSTS_PER_PAGE;

  const response = await fetch(`${BASE_URL}${APIRoute.Articles}?offset=${offset}&limit=${POSTS_PER_PAGE}`);
  const data: TArticlesServerResponse = await response.json();
  const articles: TArticle[] = formatArticles(data.articles);

  return articles;
});

export const fetchArticle = createAsyncThunk('blog/fetchArticle', async (name: string) => {
  const response = await fetch(`${BASE_URL}${APIRoute.Articles}/${name}as`);
  const data: TArticleServerResponse = await response.json();
  const article: TArticle = formatArticles([data.article])[0];

  return article;
});
