import { Pagination } from 'antd';

import './style.css';
import Post from '../Post';
import { TArticle } from '../../types/article';

interface IPostsProps {
  articles: TArticle[];
}

export default function Posts(props: IPostsProps): JSX.Element {
  const { articles } = props;
  return (
    <div className="posts">
      <ul className="posts__list">
        {articles.map((article) => (
          <li className="posts__item" key={article.id}>
            <Post article={article} />
          </li>
        ))}
      </ul>
      <Pagination />
    </div>
  );
}
