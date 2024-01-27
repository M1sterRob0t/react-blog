import { useEffect } from 'react';
import { Pagination } from 'antd';

import { POSTS_PER_PAGE, MAX_POSTS } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchArticles } from '../../state/reducers/articles/api-actions';
import Error from '../Error';
import { selectArticles, selectArticlesErrorStatus } from '../../state/selectors';

import PostsList from './PostsList/PostsList';
import './style.css';

function Posts(): JSX.Element {
  const articles = useAppSelector(selectArticles);
  const isError = useAppSelector(selectArticlesErrorStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchArticles(1));
  }, []);

  if (isError) return <Error />;

  return (
    <div className="posts">
      <PostsList articles={articles} />
      <Pagination
        className="posts__pagination"
        pageSize={POSTS_PER_PAGE}
        total={MAX_POSTS}
        onChange={(page) => dispatch(fetchArticles(page))}
        showSizeChanger={false}
      />
    </div>
  );
}
export default Posts;
