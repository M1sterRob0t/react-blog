import { Link } from 'react-router-dom';
import './style.css';
import { Button } from 'antd';

import { AppRoute } from '../../constants';

import defaultAvatar from './images/default-avatar.png';

interface IHeaderProps {
  className: string;
  isUserAuthorized: boolean;
}

export default function Header(props: IHeaderProps): JSX.Element {
  const { className, isUserAuthorized } = props;

  return (
    <header className={`${className} header`}>
      <div className="header__logo">
        <Link className="header__logo-link" to={AppRoute.Articles}>
          Realworld Blog
        </Link>
      </div>
      <div className="header__controls">
        {isUserAuthorized ? (
          <div className="header__auth-user">
            <Button className="header__create-article">Create article</Button>
            <div className="header__user-profile">
              <div className="header__user-name">John Doe</div>
              <div className="header__user-avatar">
                <img src={defaultAvatar} width="46" height="46" alt="user avatar " />
              </div>
            </div>
            <Button className="header__logout">Log Out</Button>
          </div>
        ) : (
          <div className="header__unauth-user">
            <Link to={AppRoute.Login}>
              <Button className="header__sign-in" type="text">
                Sign In
              </Button>
            </Link>
            <Link to={AppRoute.Registration}>
              <Button className="header__sign-up">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
