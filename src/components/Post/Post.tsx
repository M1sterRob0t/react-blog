import { toast } from 'react-toastify';
import { Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Tag, Button, Popconfirm } from 'antd';
import { format } from 'date-fns';

import { AppRoute, successToastConfig, errorToastConfig } from '../../constants';
import './style.css';
import {
  useDeleteArticleMutation,
  useDeleteLikeFromArticleMutation,
  usePostLikeToArticleMutation,
} from '../../services/api';
import Spinner from '../Spinner';
import { isFetchBaseQueryError, isErrorWithMessage } from '../../utils';
import type { TArticle } from '../../types/articles';
import type { TServerErrorResponse } from '../../types/registration';
import { useAppSelector } from '../../hooks/hooks';

const DATE_FROMAT = 'MMMM 	d, yyy';

interface IPostProps {
  article: TArticle;
  full?: true;
  fromUser?: boolean;
}

export default function Post(props: IPostProps) {
  const { full, fromUser, article } = props;
  const date = format(new Date(article.createdAt), DATE_FROMAT);
  const user = useAppSelector((state) => state.userInfo.user);

  const [deleteArticle, { isLoading, isSuccess, error }] = useDeleteArticleMutation();
  const [postLikeToArticle] = usePostLikeToArticleMutation();
  const [deleteLikeFromArticle] = useDeleteLikeFromArticleMutation();

  function likeButtonClickHandler(): void {
    if (!user) return;

    if (article.favorited) {
      deleteLikeFromArticle(article.slug);
    } else {
      postLikeToArticle(article.slug);
    }
  }

  if (isLoading) return <Spinner />;

  if (isSuccess) {
    toast('The article has been successfully removed!', successToastConfig);
    return <Navigate to={AppRoute.Articles} />;
  }

  if (error) {
    if (isFetchBaseQueryError(error)) {
      const serverErrorObj = error.data as TServerErrorResponse;
      const errorMessage = `Status: ${error.status}. ${serverErrorObj.errors.message}.`;
      toast(errorMessage, errorToastConfig);
    } else if (isErrorWithMessage(error)) {
      toast(error.message, errorToastConfig);
    }
  }

  return (
    <article className={`post ${full && 'post--full'}`}>
      <div className="post__header">
        <Link to={`${AppRoute.Articles}/${article.slug}`} className="post__title">
          {article.title}
        </Link>
        <span className="post__likes">
          <span className="post__likes-icon-wrapper" onClick={likeButtonClickHandler}>
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
              onConfirm={() => deleteArticle(article.slug)}
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
            <Tag className="post__tegs-item" key={tag.toLowerCase()} style={{ userSelect: 'none' }}>
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
