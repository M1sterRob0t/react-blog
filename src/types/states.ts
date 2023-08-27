import { TArticle } from './articles';

export type TBlogState = {
  articles: TArticle[];
  article: TArticle | null;
  status: 'idle' | 'loading' | 'failed';
};

export type TState = {
  blog: TBlogState;
};
