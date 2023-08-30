import { useEffect } from 'react';
import { Pagination } from 'antd';

import './style.css';
import Post from '../Post';
import Spinner from '../Spinner';
import { POSTS_PER_PAGE, MAX_POSTS } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchArticles } from '../../state/api-actions';
import { withError } from '../../hocs/withError';

function Posts(): JSX.Element {
  const articles = useAppSelector((state) => state.blog.articles);
  const isLoading = useAppSelector((state) => state.blog.isLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchArticles(1));
  }, []);

  return (
    <div className="posts">
      {isLoading ? (
        <Spinner />
      ) : (
        <ul className="posts__list">
          {articles.map((article) => (
            <li className="posts__item" key={article.slug}>
              <Post article={article} />
            </li>
          ))}
        </ul>
      )}
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
