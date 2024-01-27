import { useAppSelector } from '../hooks/hooks';
import Spinner from '../components/Spinner';
import { selectArticlesLoadingStatus, selectUserLoadingStatus } from '../state/selectors';

export function withLoading<TProps extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<TProps>
): React.FC<TProps> {
  return function WithLoadingComponent(props: TProps) {
    const isUserLoading = useAppSelector(selectUserLoadingStatus);
    const isArticleLoading = useAppSelector(selectArticlesLoadingStatus);
    if (isUserLoading || isArticleLoading) return <Spinner />;
    return <Component {...props} />;
  };
}
