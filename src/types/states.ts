import { TArticle } from './articles';

export type TBlogState = {
  articles: TArticle[];
  article: TArticle | null;
  isLoading: boolean;
  isError: boolean;
};

export type TState = {
  blog: TBlogState;
};
