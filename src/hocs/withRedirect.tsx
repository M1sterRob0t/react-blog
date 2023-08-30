import { Navigate } from 'react-router-dom';

import { useAppSelector } from '../hooks/hooks';
import { AppRoute } from '../constants';

export function withRedirect<TProps extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<TProps>
): React.FC<TProps> {
  return function WithLoadingComponent(props: TProps) {
    const user = useAppSelector((state) => state.blog.user);
    const isAuthorized = user ? true : false;

    if (isAuthorized) return <Navigate to={AppRoute.Articles} />;
    return <Component {...props} />;
  };
}
