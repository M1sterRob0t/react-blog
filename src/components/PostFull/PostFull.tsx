import { useParams } from 'react-router-dom';

import Post from '../Post';
import Spinner from '../Spinner';
import Error from '../Error';
import { useGetArticleQuery } from '../../services/api';
import { formatArticles } from '../../utils';
import { useAppSelector } from '../../hooks/hooks';

function PostFull(): JSX.Element {
  const { slug } = useParams();
  if (!slug) return <Error />;

  const { data, isError, isLoading } = useGetArticleQuery(slug);
  const user = useAppSelector((state) => state.userInfo.user);

  if (isError) return <Error />;
  if (isLoading || !data) return <Spinner />;

  const article = formatArticles([data.article])[0];
  const isFromUser = user && article ? article.author.username === user.username : false;

  return <Post article={article} full fromUser={isFromUser} />;
}

export default PostFull;
