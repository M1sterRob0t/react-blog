import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import Post from '../Post';
import Spinner from '../Spinner';
import { fetchArticle } from '../../state/api-actions';

export default function PostFull(): JSX.Element {
  const dispatch = useAppDispatch();
  const article = useAppSelector((state) => state.blog.article);
  const { name } = useParams();

  useEffect(() => {
    if (name) dispatch(fetchArticle(name));
  }, [name]);

  if (article === null) {
    return <Spinner />;
  }

  return <Post article={article} full />;
}
