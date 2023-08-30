import { useAppSelector } from '../hooks/hooks';
import Error from '../components/Error';

export function withError<TProps extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<TProps>
): React.FC<TProps> {
  return function WithErrorComponent(props: TProps) {
    const isError = useAppSelector((state) => state.blog.isError);

    if (isError) return <Error />;
    return <Component {...props} />;
  };
}
