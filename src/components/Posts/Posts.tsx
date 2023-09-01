import { useEffect } from 'react';
import { Pagination } from 'antd';

import { POSTS_PER_PAGE, MAX_POSTS } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchArticles } from '../../state/api-actions';
import { withError } from '../../hocs/withError';

import PostsList from './PostsList/PostsList';
import './style.css';

function Posts(): JSX.Element {
  const articles = useAppSelector((state) => state.blog.articles);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchArticles(1));
  }, []);

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
export default withError(Posts);
