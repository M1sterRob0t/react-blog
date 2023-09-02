import { useState } from 'react';
import { Pagination } from 'antd';

import { POSTS_PER_PAGE, MAX_POSTS } from '../../constants';
import Spinner from '../Spinner';
import Error from '../Error';
import type { TArticle } from '../../types/articles';
import { useGetArticlesQuery } from '../../services/blog';

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
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isError, isFetching, refetch } = useGetArticlesQuery(currentPage);
  const articles = data ? formatArticles(data.articles) : [];

  if (isError) return <Error />;
  return (
    <div className="posts">
      {isFetching ? <Spinner /> : <PostsList articles={articles} />}
      <Pagination
        className="posts__pagination"
        pageSize={POSTS_PER_PAGE}
        total={MAX_POSTS}
        onChange={(page) => {
          setCurrentPage(page);
          refetch();
        }}
        showSizeChanger={false}
      />
    </div>
  );
}
export default Posts;
