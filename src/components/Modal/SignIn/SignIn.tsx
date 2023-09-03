import { FormEvent, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import '../style.css';
import { Input, Typography, Button } from 'antd';
import { toast } from 'react-toastify';

import { TUserLoginRequest, TUserLogin } from '../../../types/users';
import { usePostExistingUserMutation } from '../../../services/api';
import Spinner from '../../Spinner';
import { loginAction } from '../../../state/userReducer';
import { isFetchBaseQueryError, isErrorWithMessage } from '../../../utils';
import { AppRoute, errorToastConfig, successToastConfig } from '../../../constants';
import { useAppDispatch } from '../../../hooks/hooks';

const { Title } = Typography;

const SignInForm = {
  Email: 'email',
  Password: 'password',
};

const formInfoDefault: TUserLogin = {
  email: '',
  password: '',
};

interface ISignInProps {
  className: string;
}

function SignIn(props: ISignInProps): JSX.Element {
  const { className } = props;
  const [formInfo, setFormInfo] = useState(formInfoDefault);
  const [requireLogin, { isLoading, isSuccess, isError, error, data }] = usePostExistingUserMutation();
  const dispatch = useAppDispatch();

  function formSubmitHandler(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const form = evt.target as HTMLFormElement;
    const formData = new FormData(form);

    const email = formData.get(SignInForm.Email) as string;
    const password = formData.get(SignInForm.Password) as string;

    const user: TUserLoginRequest = { user: { email, password } };

    setFormInfo({ email, password });
    requireLogin(user);
  }

  useEffect(() => {
    if (isSuccess && data) {
      toast('You successfully logged in!', successToastConfig);
      dispatch(loginAction(data.user));
    }
  }, [isSuccess]);

  if (isLoading) return <Spinner />;

  if (isSuccess) return <Navigate to={AppRoute.Articles} />;

  if (isError && error) {
    if ('status' in error && error.status === 422) {
      const message = 'Email or password is incorrect.';
      toast(message, errorToastConfig);
    } else if (isFetchBaseQueryError(error)) {
      const message = 'error' in error ? error.error : JSON.stringify(error.data);
      toast(message, errorToastConfig);
    } else if (isErrorWithMessage(error)) {
      toast(error.message, errorToastConfig);
    }
  }

  return (
    <section className={`${className} modal`}>
      <Title level={4} className="modal__title">
        Sign In
      </Title>
      <form className="modal__form" onSubmit={formSubmitHandler}>
        <label className="modal__label">
          Email address
          <Input
            className="modal__input"
            placeholder="Email address"
            type="email"
            name={SignInForm.Email}
            defaultValue={formInfo.email}
            required
          />
        </label>

        <label className="modal__label">
          Password
          <Input
            className="modal__input"
            placeholder="Password"
            type="password"
            name={SignInForm.Password}
            defaultValue={formInfo.password}
            required
          />
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

export default SignIn;
