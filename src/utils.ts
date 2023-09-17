import type { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import type { SerializedError } from '@reduxjs/toolkit';

import type { TInvalidFieldServerErrorResponse } from './types/registration';
import type { TArticle } from './types/articles';

export function formatArticles(articles: TArticle[]): TArticle[] {
  const articlesWithFilteredTags: TArticle[] = articles.map((article: TArticle) => {
    const tagsSet = new Set(article.tagList);
    const filteredTags = Array.from(tagsSet.keys()).filter((tag) => typeof tag === 'string' && tag.trim() !== '');
    return { ...article, tagList: filteredTags };
  });

  return articlesWithFilteredTags;
}

export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error;
}

export function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error != null && 'message' in error && typeof error.message === 'string';
}

export function processServerError(error: FetchBaseQueryError | SerializedError | undefined) {
  const result = {
    username: '',
    email: '',
    password: '',
  };

  if (!error) return result;
  if (!('data' in error)) return result;
  const serverError = error.data as TInvalidFieldServerErrorResponse;

  result.username = serverError.errors.username || '';
  result.email = serverError.errors.email || '';
  result.password = serverError.errors.password || '';

  return result;
}
