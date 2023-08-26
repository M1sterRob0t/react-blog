export type TArticle = {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  tags: string[];
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
