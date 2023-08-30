import { useAppSelector } from '../hooks/hooks';
import Spinner from '../components/Spinner';

export function withLoading<TProps extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<TProps>
): React.FC<TProps> {
  return function WithLoadingComponent(props: TProps) {
    const isLoading = useAppSelector((state) => state.blog.isLoading);

    if (isLoading) return <Spinner />;
    return <Component {...props} />;
  };
}
