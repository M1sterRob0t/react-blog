import { Pagination } from 'antd';

import { POSTS_PER_PAGE, MAX_POSTS } from '../../constants';
import { useGetArticlesQuery } from '../../services/blog';
import Spinner from '../Spinner';
import Error from '../Error';
import type { TArticle } from '../../types/articles';

import PostsList from './PostsList';
import './style.css';

function formatArticles(articles: TArticle[]): TArticle[] {
  const articlesWithFilteredTags: TArticle[] = articles.map((article: TArticle) => {
    const tagsSet = new Set(article.tagList);
    const filteredTags = Array.from(tagsSet.keys()).filter((tag) => typeof tag === 'string' && tag.trim() !== '');
    return { ...article, tagList: filteredTags };
  });

  return articlesWithFilteredTags;
}

function Posts(): JSX.Element {
  const { data, isError, isLoading } = useGetArticlesQuery({});
  const articles = data ? formatArticles(data.articles) : [];

  if (isError) return <Error />;
  if (isLoading) return <Spinner />;
  return (
    <div className="posts">
      <PostsList articles={articles} />
      <Pagination
        className="posts__pagination"
        pageSize={POSTS_PER_PAGE}
        total={MAX_POSTS}
        onChange={(page) => console.log(page)}
        showSizeChanger={false}
      />
    </div>
  );
}
export default Posts;
