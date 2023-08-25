import './style.css';
import { Button } from 'antd';

import defaultAvatar from './images/default-avatar.png';

export default function Header(): JSX.Element {
  return (
    <header className="header">
      <div className="header__logo">
        <a className="header__logo-link" href="#">
          Realworld Blog
        </a>
      </div>
      <div className="header__controls-unauth">
        <div className="header__unauth-user">
          <Button className="header__sign-in" type="text" size="large">
            Sign In
          </Button>
          <Button className="header__sign-up" size="large">
            Sign Up
          </Button>
        </div>

        <div className="header__auth-user">
          <Button className="header__create-article" size="small">
            Create article
          </Button>
          <div className="header__user-profile">
            <div className="header__user-name">John Doe</div>
            <div className="header__user-avatar">
              <img src={defaultAvatar} width="46" height="46" alt="user avatar " />
            </div>
          </div>
          <Button className="header__logout" size="large">
            Log Out
          </Button>
        </div>
      </div>
    </header>
  );
}
