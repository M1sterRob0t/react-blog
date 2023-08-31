import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Tag, Button, Popconfirm } from 'antd';
import { format } from 'date-fns';

import { AppRoute } from '../../constants';
import type { TArticle } from '../../types/articles';
import './style.css';
import { useAppDispatch } from '../../hooks/hooks';
import { deleteUserArticle } from '../../state/api-actions';

const DATE_FROMAT = 'MMMM 	d, yyy';

interface IPostProps {
  article: TArticle;
  full?: true;
  fromUser?: boolean;
}

export default function Post(props: IPostProps) {
  const { full, fromUser, article } = props;
  const dispatch = useAppDispatch();
  const date = format(new Date(article.createdAt), DATE_FROMAT);

  const onConfirm = (): void => {
    dispatch(deleteUserArticle(article.slug));
  };

  return (
    <article className={`post ${full && 'post--full'}`}>
      <div className="post__header">
        <Link to={`${AppRoute.Articles}/${article.slug}`} className="post__title">
          {article.title}
        </Link>
        <span className="post__likes">
          <span className="post__likes-icon-wrapper">
            {article.favorited ? (
              <HeartFilled className="post__likes-icon post__likes-icon--clicked" />
            ) : (
              <HeartOutlined className="post__likes-icon" />
            )}
          </span>
          <span className="post__likes-count">{article.favoritesCount}</span>
        </span>
      </div>
      <div className="post__info">
        <div className="post__info-container">
          <div className="post__details">
            <div className="post__user-name">{article.author.username}</div>
            <div className="post__date">{date}</div>
          </div>
          <div className="post__user-avatar">
            <img src={article.author.image} width="46" height="46px" alt="user avatar" />
          </div>
        </div>
        {fromUser && (
          <div className="post__info-controls">
            <Popconfirm
              className="post__popconfirm"
              title="Are you sure to delete this article?"
              onConfirm={onConfirm}
              okText="Yes"
              cancelText="No"
              placement="rightTop"
            >
              <Button className="post__delit-button" danger>
                Delete
              </Button>
            </Popconfirm>
            <Link to={`${AppRoute.Articles}/${article.slug}/edit`}>
              <Button className="post__edit-button">Edit</Button>
            </Link>
          </div>
        )}
      </div>
      <div className="post__desc">
        <div className="post__tegs-list">
          {article.tagList.map((tag) => (
            <Tag className="post__tegs-item" key={tag.toLowerCase()}>
              {tag}
            </Tag>
          ))}
        </div>
        <p className="post__desc-text">{article.description}</p>
      </div>
      {full && <div className="post__body">{<ReactMarkdown>{article.body}</ReactMarkdown>}</div>}
    </article>
  );
}
