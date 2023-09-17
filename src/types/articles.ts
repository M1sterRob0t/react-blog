export type TArticle = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    image: string;
    following: boolean;
  };
};

export type TArticlesSuccessResponse = {
  articles: TArticle[];
  articlesCount: number;
};

export type TArticlesErrorResponse = {
  errors: {
    body: string[];
  };
};

export type TArticleResponse = {
  article: TArticle;
};

export type TNewArticle = {
  title: string;
  description: string;
  body: string;
  tagList: string[];
};

export type TNewArticleRequest = {
  article: TNewArticle;
};
