import type { TArticle } from './types/articles';

export function formatArticles(articles: TArticle[]): TArticle[] {
  const articlesWithFilteredTags: TArticle[] = articles.map((article: TArticle) => {
    const tagsSet = new Set(article.tagList);
    const filteredTags = Array.from(tagsSet.keys()).filter((tag) => typeof tag === 'string' && tag.trim() !== '');
    return { ...article, tagList: filteredTags };
  });

  return articlesWithFilteredTags;
}
