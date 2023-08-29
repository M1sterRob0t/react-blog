import { TArticle } from './articles';
import { TUserInfo } from './users';

export type TBlogState = {
  articles: TArticle[];
  article: TArticle | null;
  isLoading: boolean;
  isError: boolean;
  user: TUserInfo | null;
};

export type TState = {
  blog: TBlogState;
};
