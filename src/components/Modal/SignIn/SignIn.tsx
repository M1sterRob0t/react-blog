import { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import '../style.css';
import { Input, Typography, Button } from 'antd';

import { TUserLoginRequest } from '../../../types/users';
import { requireLogin } from '../../../state/api-actions';
import { useAppDispatch } from '../../../hooks/hooks';
import { AppRoute } from '../../../constants';
import { withLoading } from '../../../hocs/withLoading';
import { withRedirect } from '../../../hocs/withRedirect';

const SignInForm = {
  Email: 'email',
  Password: 'password',
};

interface ISignInProps {
  className: string;
}
const { Title } = Typography;

function SignIn(props: ISignInProps): JSX.Element {
  const { className } = props;
  const dispatch = useAppDispatch();

  function formSubmitHandler(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const form = evt.target as HTMLFormElement;
    const formData = new FormData(form);

    const email = formData.get(SignInForm.Email) as string;
    const password = formData.get(SignInForm.Password) as string;

    const user: TUserLoginRequest = { user: { email, password } };

    dispatch(requireLogin(user));
  }

  return (
    <section className={`${className} modal`}>
      <Title level={4} className="modal__title">
        Sign In
      </Title>
      <form className="modal__form" onSubmit={formSubmitHandler}>
        <label className="modal__label">
          Email address
          <Input className="modal__input" placeholder="Email address" type="email" name={SignInForm.Email} required />
        </label>

        <label className="modal__label">
          Password
          <Input className="modal__input" placeholder="Password" type="password" name={SignInForm.Password} required />
        </label>

        <Button className="modal__submit" type="primary" htmlType="submit">
          Login
        </Button>
      </form>
      <div className="modal__message">
        <span className="modal__message-text">
          Don’t have an account?
          <Link to={AppRoute.Registration} className="modal__message-link">
            Sign Up
          </Link>
          .
        </span>
      </div>
    </section>
  );
}

export default withRedirect(withLoading<ISignInProps & JSX.IntrinsicAttributes>(SignIn));
