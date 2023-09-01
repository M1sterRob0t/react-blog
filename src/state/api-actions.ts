import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import type { TArticle, TArticlesResponse, TArticleResponse, TNewArticleRequest } from '../types/articles';
import type { TNewUserRequest, TUserInfo, TNewUser, TUserLoginRequest, TUserEditRequest } from '../types/users';
import { POSTS_PER_PAGE, errorToastConfig, successToastConfig } from '../constants';

import { clearArticleAction, setErrorAction } from './reducer';
import { getUserInfo } from './userInfo';

const BASE_URL = 'https://blog.kata.academy/api';
enum Endpoint {
  Articles = '/articles',
  Users = '/users',
  Login = '/users/login',
  User = '/user',
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

export const postNewUser = createAsyncThunk('blog/postNewUser', async (newUser: TNewUserRequest, { dispatch }) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(newUser),
  };

  const response = await fetch(`${BASE_URL}${Endpoint.Users}`, options);
  const data = await response.json();

  if (response.status === 200) {
    const user: TUserInfo = data.user;
    toast('Your registration was successful!', successToastConfig);
    dispatch(setErrorAction(null));
    return user;
  } else if (response.status === 422) {
    const error: TNewUser = {
      username: data.errors.username || '',
      email: data.errors.email || '',
      password: data.errors.password || '',
    };

    dispatch(setErrorAction(error));
    return Promise.reject();
  } else {
    const errorMessage = `Status: ${response.status}. ${response.statusText}`;
    toast(errorMessage, errorToastConfig);
    return Promise.reject();
  }
});

export const requireLogin = createAsyncThunk('blog/requireLogin', async (user: TUserLoginRequest) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(user),
  };

  const response = await fetch(`${BASE_URL}${Endpoint.Login}`, options);
  const data = await response.json();

  if (response.status === 200) {
    const user: TUserInfo = data.user;
    toast('You have successfully logged in!', successToastConfig);
    return user;
  } else {
    const errorMessage = `Status: ${response.status}. ${response.statusText}`;
    toast(errorMessage, errorToastConfig);
    return Promise.reject();
  }
});

export const postUpdatedUser = createAsyncThunk(
  'blog/postUpdatedUser',
  async (updatedUser: TUserEditRequest, { dispatch }) => {
    const authToken = getUserInfo().token;
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Token ${authToken}`,
        accept: 'application/json',
      },
      body: JSON.stringify(updatedUser),
    };

    const response = await fetch(`${BASE_URL}${Endpoint.User}`, options);
    const data = await response.json();

    if (response.status === 200) {
      const user: TUserInfo = data.user;
      toast('Successfully updated!', successToastConfig);
      dispatch(setErrorAction(null));
      return user;
    } else if (response.status === 422) {
      const error: TNewUser = {
        username: data.errors.username || '',
        email: data.errors.email || '',
        password: data.errors.password || '',
      };

      dispatch(setErrorAction(error));
      return Promise.reject();
    } else {
      const errorMessage = `Status: ${response.status}. ${data.errors.message}.`;
      toast(errorMessage, errorToastConfig);
      return Promise.reject();
    }
  }
);

export const postNewArticle = createAsyncThunk('blog/postNewArticle', async (newArticle: TNewArticleRequest) => {
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
  'blog/updateUserArticle',
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

export const deleteUserArticle = createAsyncThunk('blog/deleteUserArticle', async (slug: string, { dispatch }) => {
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
