import { FormEvent, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Input, Typography, Button } from 'antd';

import Spinner from '../../Spinner';
import { postNewUser } from '../../../state/api-actions';
import type { TNewUser, TNewUserRequest } from '../../../types/users';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import '../style.css';
import { getUserInfo } from '../../../state/userInfo';
import { AppRoute, INPUT_INVALID_CLASS } from '../../../constants';

const SignUpForm = {
  Username: 'username',
  Email: 'email',
  Password: 'password',
  RepeatedPassword: 'repeated-password',
  Agreement: 'agreement',
};

const formInfoDefault: TNewUser = {
  username: '',
  email: '',
  password: '',
};

interface ISignUpProps {
  className: string;
}
const { Title } = Typography;

export default function SignUp(props: ISignUpProps): JSX.Element {
  const { className } = props;
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.blog.error);
  const isLoading = useAppSelector((state) => state.blog.isLoading);
  const [formInfo, setFormInfo] = useState(formInfoDefault);
  const isAuthorized = getUserInfo();

  function formSubmitHandler(evt: FormEvent<HTMLFormElement>): void {
    evt.preventDefault();
    const form = evt.target as HTMLFormElement;
    const formData = new FormData(form);

    const repeatedPassInput = form.querySelector(`input[name="${SignUpForm.RepeatedPassword}"]`) as HTMLInputElement;
    const username = formData.get(SignUpForm.Username) as string;
    const email = formData.get(SignUpForm.Email) as string;
    const password = formData.get(SignUpForm.Password) as string;
    const repeatedPass = formData.get(SignUpForm.RepeatedPassword) as string;

    if (password !== repeatedPass) {
      repeatedPassInput.classList.add(INPUT_INVALID_CLASS);
      return;
    }

    const newUser: TNewUserRequest = { user: { username, email, password } };

    setFormInfo({ username, email, password });
    dispatch(postNewUser(newUser));
  }

  function inputInvalidHandler(evt: FormEvent<HTMLInputElement>): void {
    const input = evt.target as HTMLInputElement;
    if (input.validity.valid) input.classList.remove(INPUT_INVALID_CLASS);
    else input.classList.add(INPUT_INVALID_CLASS);
  }

  function inputChnageHandler(evt: FormEvent<HTMLInputElement>): void {
    const input = evt.target as HTMLInputElement;
    if (input.validity.valid) input.classList.remove(INPUT_INVALID_CLASS);
  }
  if (isAuthorized) return <Navigate to={AppRoute.Articles} />;
  if (isLoading) return <Spinner />;

  return (
    <section className={`${className} modal`}>
      <Title level={4} className="modal__title">
        Create new account
      </Title>
      <form className="modal__form" onSubmit={formSubmitHandler}>
        <label className="modal__label">
          Username
          <Input
            className={`modal__input ${error && error.username ? INPUT_INVALID_CLASS : ''}`}
            placeholder="Username"
            name={SignUpForm.Username}
            type="text"
            minLength={3}
            maxLength={20}
            required
            onInvalid={inputInvalidHandler}
            onChange={inputChnageHandler}
            defaultValue={formInfo.username}
          />
          <span className="modal__invalid-message">
            Username {error?.username || 'needs to be from 3 to 20 characters.'}
          </span>
        </label>

        <label className="modal__label">
          Email address
          <Input
            className={`modal__input ${error && error.email ? INPUT_INVALID_CLASS : ''}`}
            placeholder="Email address"
            name={SignUpForm.Email}
            type="email"
            required
            onInvalid={inputInvalidHandler}
            onChange={inputChnageHandler}
            defaultValue={formInfo.email}
          />
          <span className="modal__invalid-message">{`Email ${error?.email || 'needs to be correct.'}`}</span>
        </label>

        <label className="modal__label">
          Password
          <Input
            className={`modal__input ${error && error.password ? INPUT_INVALID_CLASS : ''}`}
            placeholder="Password"
            type="password"
            name={SignUpForm.Password}
            minLength={6}
            maxLength={40}
            required
            onInvalid={inputInvalidHandler}
            onChange={inputChnageHandler}
            defaultValue={formInfo.password}
          />
          <span className="modal__invalid-message">{`Password ${
            error?.password || 'needs to be from 6 to 40 characters.'
          }`}</span>
        </label>

        <label className="modal__label">
          Repeat Password
          <Input
            className="modal__input"
            placeholder="Password"
            type="password"
            name={SignUpForm.RepeatedPassword}
            minLength={6}
            maxLength={40}
            required
            onInvalid={inputInvalidHandler}
            onChange={inputChnageHandler}
            defaultValue={formInfo.password}
          />
          <span className="modal__invalid-message">Passwords must match.</span>
        </label>
        <label className="modal__checkbox-label">
          <Input
            className="modal__checkbox"
            type="checkbox"
            name={SignUpForm.Agreement}
            value="yes"
            defaultChecked
            required
          />
          <span>I agree to the processing of my personal information</span>
        </label>
        <Button className="modal__submit" type="primary" htmlType="submit">
          Create
        </Button>
      </form>
      <div className="modal__message">
        <span className="modal__message-text">
          Already have an account?
          <Link to={AppRoute.Login} className="modal__message-link">
            Sign In
          </Link>
          .
        </span>
      </div>
    </section>
  );
}
