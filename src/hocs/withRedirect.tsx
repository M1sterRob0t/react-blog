import { Navigate, useLocation, useParams } from 'react-router-dom';

import { useAppSelector } from '../hooks/hooks';
import { AppRoute } from '../constants';

export function withRedirect<TProps extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<TProps>
): React.FC<TProps> {
  return function WithRedirectComponent(props: TProps) {
    const user = useAppSelector((state) => state.userInfo.user);
    const isAuthorized = user ? true : false;
    const { pathname } = useLocation();
    const { slug } = useParams();

    const appRouteEditArticle = `${AppRoute.Articles}/${slug}/edit`;
    const isPrivateRoute =
      pathname === AppRoute.NewArticle || pathname === AppRoute.Profile || pathname === appRouteEditArticle;

    if (isAuthorized && pathname === AppRoute.Login) return <Navigate to={AppRoute.Root} />;
    else if (isAuthorized && pathname === AppRoute.Registration) return <Navigate to={AppRoute.Root} />;
    else if (isPrivateRoute && !isAuthorized) return <Navigate to={AppRoute.Login} />;
    else return <Component {...props} />;
  };
}
