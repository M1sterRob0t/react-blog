import '../style.css';
import Post from '../../Post';
import { withLoading } from '../../../hocs/withLoading';
import { TArticle } from '../../../types/articles';

interface IPostsList {
  articles: TArticle[];
}

function PostsList({ articles }: IPostsList): JSX.Element {
  return (
    <ul className="posts__list">
      {articles.map((article) => (
        <li className="posts__item" key={article.slug}>
          <Post article={article} />
        </li>
      ))}
    </ul>
  );
}

export default withLoading<IPostsList & JSX.IntrinsicAttributes>(PostsList);
