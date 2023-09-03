import { useState } from 'react';
import { Pagination } from 'antd';

import { POSTS_PER_PAGE, MAX_POSTS } from '../../constants';
import Spinner from '../Spinner';
import Error from '../Error';
import { useGetArticlesQuery } from '../../services/api';
import { formatArticles } from '../../utils';

import PostsList from './PostsList';
import './style.css';

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
