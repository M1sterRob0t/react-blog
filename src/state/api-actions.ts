import { nanoid } from 'nanoid';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { TArticle, TServerArticle, TArticleServerResponse } from '../types/articles';
import { POSTS_PER_PAGE } from '../constants';

const BASE_URL = 'https://blog.kata.academy/api/';
enum APIRoute {
  Articles = '/articles',
}

function formatArticles(articles: TServerArticle[]): TArticle[] {
  const articlesWithId: TArticle[] = articles.map((article: TServerArticle) => ({ ...article, id: nanoid() }));
  const articlesWithIdAndFilteredTags: TArticle[] = articlesWithId.map((article: TArticle) => {
    const tagsSet = new Set(article.tagList);
    const filteredTags = Array.from(tagsSet.keys());
    return { ...article, tagList: filteredTags };
  });

  return articlesWithIdAndFilteredTags;
}

export const fetchArticles = createAsyncThunk('blog/fetchArticles', async (page: number) => {
  const offset = page === 1 ? 0 : page * POSTS_PER_PAGE - POSTS_PER_PAGE;
  console.log(offset);
  const response = await fetch(`${BASE_URL}${APIRoute.Articles}?offset=${offset}&limit=${POSTS_PER_PAGE}`);
  const data: TArticleServerResponse = await response.json();
  const articles: TArticle[] = formatArticles(data.articles);
  console.log(articles);
  return articles;
});
