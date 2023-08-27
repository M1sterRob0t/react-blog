import { Pagination } from 'antd';

import './style.css';
import Post from '../Post';
import Spinner from '../Spinner';
import Error from '../Error';
import { TArticle } from '../../types/articles';
import { POSTS_PER_PAGE, MAX_POSTS } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchArticles } from '../../state/api-actions';

interface IPostsProps {
  articles: TArticle[];
}

export default function Posts(props: IPostsProps): JSX.Element {
  const { articles } = props;

  const isLoading = useAppSelector((state) => state.blog.isLoading);
  const isError = useAppSelector((state) => state.blog.isError);
  const dispatch = useAppDispatch();

  if (isError) return <Error />;

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
