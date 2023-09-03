import { useParams } from 'react-router-dom';

import Post from '../Post';
import Spinner from '../Spinner';
import Error from '../Error';
import { useGetArticleQuery } from '../../services/api';
import { formatArticles } from '../../utils';

function PostFull(): JSX.Element {
  const { slug } = useParams();
  if (!slug) return <Error />;

  const { data, isError, isLoading } = useGetArticleQuery(slug);
  if (isError) return <Error />;
  if (isLoading || !data) return <Spinner />;

  const article = formatArticles([data.article])[0];

  return <Post article={article} full />;
}

export default PostFull;
