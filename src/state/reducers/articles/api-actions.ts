import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import { getUserInfo } from '../../userInfo';
import type { TArticle, TArticlesResponse, TArticleResponse, TNewArticleRequest } from '../../../types/articles';
import { BASE_URL, Endpoint, POSTS_PER_PAGE, errorToastConfig, successToastConfig } from '../../../constants';
import { RootState } from '../../store';

import { clearArticleAction } from './articlesReducer';

function formatArticles(articles: TArticle[]): TArticle[] {
  const articlesWithFilteredTags: TArticle[] = articles.map((article: TArticle) => {
    const tags = article.tagList.filter((tag) => typeof tag === 'string' && tag.trim() !== '');
    const tagsSet = new Set(tags);
    const filteredTags = Array.from(tagsSet.keys());

    return { ...article, tagList: filteredTags };
  });

  return articlesWithFilteredTags;
}

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async (page: number) => {
  const offset = page === 1 ? 0 : page * POSTS_PER_PAGE - POSTS_PER_PAGE;
  const authToken = getUserInfo()?.token || '';
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Token ${authToken}`,
      accept: 'application/json',
    },
  };

  const response = await fetch(`${BASE_URL}${Endpoint.Articles}?offset=${offset}&limit=${POSTS_PER_PAGE}`, options);
  const data: TArticlesResponse = await response.json();
  const articles: TArticle[] = formatArticles(data.articles);

  return articles;
});

export const fetchArticle = createAsyncThunk('articles/fetchArticle', async (name: string) => {
  const authToken = getUserInfo()?.token || '';
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Token ${authToken}`,
      accept: 'application/json',
    },
  };

  const response = await fetch(`${BASE_URL}${Endpoint.Articles}/${name}`, options);
  const data: TArticleResponse = await response.json();
  const article: TArticle = formatArticles([data.article])[0];

  return article;
});

export const postNewArticle = createAsyncThunk('articles/postNewArticle', async (newArticle: TNewArticleRequest) => {
  const authToken = getUserInfo().token;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Token ${authToken}`,
      accept: 'application/json',
    },
    body: JSON.stringify(newArticle),
  };

  const response = await fetch(`${BASE_URL}${Endpoint.Articles}`, options);
  const data = await response.json();
  if (response.status === 200) {
    toast('The article has been successfully created!', successToastConfig);
    return data.article;
  } else {
    const errorMessage = `Status: ${response.status}. ${data.errors.message}.`;
    toast(errorMessage, errorToastConfig);
    return Promise.reject();
  }
});

interface IUpdateUserArticle {
  newArticle: TNewArticleRequest;
  slug: string;
}

export const updateUserArticle = createAsyncThunk(
  'articles/updateUserArticle',
  async ({ newArticle, slug }: IUpdateUserArticle) => {
    const authToken = getUserInfo().token;
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Token ${authToken}`,
        accept: 'application/json',
      },
      body: JSON.stringify(newArticle),
    };

    const response = await fetch(`${BASE_URL}${Endpoint.Articles}/${slug}`, options);
    const data = await response.json();

    if (response.status === 200) {
      toast('The article has been successfully updated!', successToastConfig);
      return data.article;
    } else {
      const errorMessage = `Status: ${response.status}. ${data.errors.message}.`;
      toast(errorMessage, errorToastConfig);
      return Promise.reject();
    }
  }
);

export const deleteUserArticle = createAsyncThunk('articles/deleteUserArticle', async (slug: string, { dispatch }) => {
  const authToken = getUserInfo().token;
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Token ${authToken}`,
      accept: 'application/json',
    },
  };

  const response = await fetch(`${BASE_URL}${Endpoint.Articles}/${slug}`, options);
  if (response.status === 200 || response.status === 204) {
    toast('The article has been successfully deleted!', successToastConfig);
    dispatch(clearArticleAction());
  } else {
    const errorMessage = `Status: ${response.status}. ${response.statusText}.`;
    toast(errorMessage, errorToastConfig);
    return Promise.reject();
  }
});

export const postLikeToArticle = createAsyncThunk<TArticle, string, { state: RootState }>(
  'articles/postLikeToArticle',
  async (slug: string, { getState, requestId, rejectWithValue }) => {
    const currentRequestId = getState().articles.currentRequestId;

    if (requestId !== currentRequestId) {
      console.log('request canceled');
      return rejectWithValue('Request have been already sent!');
    }

    const authToken = getUserInfo().token;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Token ${authToken}`,
        accept: 'application/json',
      },
    };
    console.log('request sended...');
    const response = await fetch(`${BASE_URL}${Endpoint.Articles}/${slug}/favorite`, options);
    const data: TArticleResponse = await response.json();
    const article: TArticle = formatArticles([data.article])[0];
    console.log('request completed...');
    return article;
  }
);

export const deleteLikeFromArticle = createAsyncThunk<TArticle, string, { state: RootState }>(
  'articles/deleteLikeFromArticle',
  async (slug: string, { getState, requestId, rejectWithValue }) => {
    const currentRequestId = getState().articles.currentRequestId;

    if (currentRequestId !== requestId) {
      console.log('request canceled');
      return rejectWithValue('Request have been already sent!');
    }
    const authToken = getUserInfo().token;
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Token ${authToken}`,
        accept: 'application/json',
      },
    };
    console.log('request sended...');
    const response = await fetch(`${BASE_URL}${Endpoint.Articles}/${slug}/favorite`, options);
    const data: TArticleResponse = await response.json();
    const article: TArticle = formatArticles([data.article])[0];
    console.log('request completed...');
    return article;
  }
);
