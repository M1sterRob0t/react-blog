import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import Post from '../Post';
import Spinner from '../Spinner';
import { fetchArticle } from '../../state/api-actions';
import Error from '../Error';

export default function PostFull(): JSX.Element {
  const dispatch = useAppDispatch();
  const article = useAppSelector((state) => state.blog.article);
  const user = useAppSelector((state) => state.blog.user);
  const isLoading = useAppSelector((state) => state.blog.isLoading);
  const isError = useAppSelector((state) => state.blog.isError);
  const isFromUser = article && user ? article.author.username === user.username : false;
  const { name } = useParams();

  useEffect(() => {
    if (name) dispatch(fetchArticle(name));
  }, [name]);

  if (isError) return <Error />;
  if (isLoading || !article) return <Spinner />;
  return <Post article={article} full fromUser={isFromUser} />;
}
