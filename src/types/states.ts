import { TArticle } from './articles';
import { TNewUser, TUserInfo } from './users';

export type TBlogState = {
  articles: TArticle[];
  article: TArticle | null;
  isLoading: boolean;
  isError: boolean;
  isUpdated: boolean;
  user: TUserInfo | null;
  serverError: TNewUser | null;
};

export type TState = {
  blog: TBlogState;
};
