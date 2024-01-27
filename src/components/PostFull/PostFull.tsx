import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import Post from '../Post';
import Spinner from '../Spinner';
import { fetchArticle } from '../../state/reducers/articles/api-actions';
import { withRedirect } from '../../hocs/withRedirect';
import Error from '../Error';
import {
  selectArticlesErrorStatus,
  selectArticlesLoadingStatus,
  selectUserErrorStatus,
  selectUserLoadingStatus,
  selectArticle,
  selectUser,
} from '../../state/selectors';

function PostFull(): JSX.Element {
  const dispatch = useAppDispatch();
  const article = useAppSelector(selectArticle);
  const user = useAppSelector(selectUser);
  const isUserLoading = useAppSelector(selectUserLoadingStatus);
  const isArticlerLoading = useAppSelector(selectArticlesLoadingStatus);
  const isUserError = useAppSelector(selectUserErrorStatus);
  const isArticleError = useAppSelector(selectArticlesErrorStatus);
  const isFromUser = article && user ? article.author.username === user.username : false;
  const { name } = useParams();

  useEffect(() => {
    if (name) dispatch(fetchArticle(name));
  }, []);

  if (isUserError || isArticleError || !article) return <Error />;
  if (isUserLoading || isArticlerLoading) return <Spinner />;
  return <Post article={article} full fromUser={isFromUser} />;
}

export default withRedirect(PostFull);
