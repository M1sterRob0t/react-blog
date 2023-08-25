import { Pagination } from 'antd';

import './style.css';
import Post from '../Post';

export default function ArticlesList(): JSX.Element {
  return (
    <div className="posts">
      <ul className="posts__list">
        <li className="posts__item">
          <Post />
        </li>
        <li className="posts__item">
          <Post />
        </li>
      </ul>
      <Pagination />
    </div>
  );
}
