import { TArticle } from './articles';

export type TBlogState = {
  articles: TArticle[];
  status: 'idle' | 'loading' | 'failed';
};

export type TState = {
  blog: TBlogState;
};
