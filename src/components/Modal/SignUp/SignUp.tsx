import { toast } from 'react-toastify';
import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Typography, Button } from 'antd';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import type { SerializedError } from '@reduxjs/toolkit';

import { usePostNewUserMutation } from '../../../services/blog';
import type { TNewUser, TNewUserRequest } from '../../../types/users';
import type { TInvalidFieldServerErrorResponse, TServerErrorResponse } from '../../../types/registration';
import { AppRoute, INPUT_INVALID_CLASS, errorToastConfig, successToastConfig } from '../../../constants';
import { saveUserInfo } from '../../../services/userInfo';
import Spinner from '../../Spinner';
import '../style.css';

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

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error;
}

function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error != null && 'message' in error && typeof error.message === 'string';
}

function processServerError(error: FetchBaseQueryError | SerializedError | undefined) {
  const result = {
    username: '',
    email: '',
    password: '',
  };

  if (!error) return result;
  if (!('data' in error)) return result;
  const serverError = error.data as TInvalidFieldServerErrorResponse;

  result.username = serverError.errors.username || '';
  result.email = serverError.errors.email || '';
  result.password = serverError.errors.password || '';

  return result;
}

function SignUp(props: ISignUpProps): JSX.Element {
  const { className } = props;
  const [formInfo, setFormInfo] = useState(formInfoDefault);
  const [postNewUser, { error, isError, isSuccess, isLoading, data }] = usePostNewUserMutation();
  const serverError = processServerError(error);

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
    postNewUser(newUser);
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

  if (isLoading) <Spinner />;

  if (isSuccess && data) {
    saveUserInfo(data.user);
    toast('Your registration was successful!', successToastConfig);
  }

  if (isError) {
    if (isFetchBaseQueryError(error) && error.status !== 422) {
      const serverErrorObj = error.data as TServerErrorResponse;
      const errorMessage = `Status: ${error.status}. ${serverErrorObj.errors.message}.`;
      toast(errorMessage, errorToastConfig);
    } else if (isErrorWithMessage(error)) {
      toast(error.message, errorToastConfig);
    }
  }

  return (
    <section className={`${className} modal`}>
      <Title level={4} className="modal__title">
        Create new account
      </Title>
      <form className="modal__form" onSubmit={formSubmitHandler}>
        <label className="modal__label">
          Username
          <Input
            className={`modal__input ${serverError.username ? INPUT_INVALID_CLASS : ''}`}
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
            Username {serverError.username || 'needs to be from 3 to 20 characters.'}
          </span>
        </label>

        <label className="modal__label">
          Email address
          <Input
            className={`modal__input ${serverError.email ? INPUT_INVALID_CLASS : ''}`}
            placeholder="Email address"
            name={SignUpForm.Email}
            type="email"
            required
            onInvalid={inputInvalidHandler}
            onChange={inputChnageHandler}
            defaultValue={formInfo.email}
          />
          <span className="modal__invalid-message">Email {serverError.email || 'needs to be correct.'}</span>
        </label>

        <label className="modal__label">
          Password
          <Input
            className={`modal__input ${serverError.password ? INPUT_INVALID_CLASS : ''}`}
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
            serverError.password || 'needs to be from 6 to 40 characters.'
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

export default SignUp;
