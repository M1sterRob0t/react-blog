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
    bio: string;
    image: string;
    following: boolean;
  };
};

export type TArticlesResponse = {
  articles: TArticle[];
  articlesCount: number;
};

export type TArticleResponse = {
  article: TArticle;
};
