import { TArticle } from './articles';
import { TNewUser, TUserInfo } from './users';

export type TBlogState = {
  articles: TArticle[];
  article: TArticle | null;
  isLoading: boolean;
  isError: boolean;
  user: TUserInfo | null;
  error: TNewUser | null;
};

export type TState = {
  blog: TBlogState;
};
