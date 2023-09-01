import { Navigate } from 'react-router-dom';

import { useAppSelector } from '../hooks/hooks';
import { AppRoute } from '../constants';

export function withUpdate<TProps extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<TProps>
): React.FC<TProps> {
  return function WithRedirectComponent(props: TProps) {
    const isUpdated = useAppSelector((state) => state.blog.isUpdated);

    if (isUpdated) return <Navigate to={`${AppRoute.Articles}`} />;
    return <Component {...props} />;
  };
}
