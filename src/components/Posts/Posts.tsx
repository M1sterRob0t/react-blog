import { Pagination } from 'antd';

import './style.css';
import Post from '../Post';
import { TArticle } from '../../types/articles';
import { POSTS_PER_PAGE, MAX_POSTS } from '../../constants';
import { useAppDispatch } from '../../hooks/hooks';
import { fetchArticles } from '../../state/api-actions';

interface IPostsProps {
  articles: TArticle[];
}

export default function Posts(props: IPostsProps): JSX.Element {
  const dispatch = useAppDispatch();

  const { articles } = props;
  return (
    <div className="posts">
      <ul className="posts__list">
        {articles.map((article) => (
          <li className="posts__item" key={article.slug}>
            <Post article={article} />
          </li>
        ))}
      </ul>
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
