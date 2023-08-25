import './style.css';
import { HeartOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import defaultAvatar from './images/default-avatar.png';

export default function Post() {
  return (
    <article className="post">
      <div className="post__header">
        <h2 className="post__title">Some article title </h2>
        <span className="post__likes">
          <span className="post__likes-icon">
            <HeartOutlined />
          </span>
          <span className="post__likes-count">12</span>
        </span>
      </div>
      <div className="post__info">
        <div className="post__inner-wrapper">
          <div className="post__user-name">John Doe</div>
          <div className="post__date">March 5, 2020 </div>
        </div>
        <div className="post__user-avatar">
          <img src={defaultAvatar} width="46" height="46px" alt="user avatar" />
        </div>
      </div>

      <div className="post__tegs-list">
        <Button className="post__tegs-item">Tag1</Button>
      </div>
      <p className="post__text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.
      </p>
    </article>
  );
}
