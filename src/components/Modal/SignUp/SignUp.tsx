import { FormEvent } from 'react';
import { Input, Typography, Button } from 'antd';

import { postNewUser } from '../../../state/api-actions';
import { TNewUser } from '../../../types/users';
import { useAppDispatch } from '../../../hooks/hooks';

import '../style.css';

const INPUT_INVALID_CLASS = 'modal__input--invalid';
const SignUpForm = {
  Username: 'username',
  Email: 'email',
  Password: 'password',
  RepeatedPassword: 'repeated-password',
  Agreement: 'agreement',
};

interface ISignUpProps {
  className: string;
}
const { Title } = Typography;

export default function SignUp(props: ISignUpProps): JSX.Element {
  const { className } = props;
  const dispatch = useAppDispatch();

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

    const newUser: TNewUser = { user: { username, email, password } };

    console.log(newUser);
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

  return (
    <section className={`${className} modal`}>
      <Title level={4} className="modal__title">
        Create new account
      </Title>
      <form className="modal__form" onSubmit={formSubmitHandler}>
        <label className="modal__label">
          Username
          <Input
            className="modal__input"
            placeholder="Username"
            name={SignUpForm.Username}
            type="text"
            minLength={3}
            maxLength={20}
            required
            onInvalid={inputInvalidHandler}
            onChange={inputChnageHandler}
          />
          <span className="modal__invalid-message">Your name needs to be from 3 to 20 characters.</span>
        </label>

        <label className="modal__label">
          Email address
          <Input
            className="modal__input"
            placeholder="Email address"
            name={SignUpForm.Email}
            type="email"
            required
            onInvalid={inputInvalidHandler}
            onChange={inputChnageHandler}
          />
          <span className="modal__invalid-message">Your email needs to be correct.</span>
        </label>

        <label className="modal__label">
          Password
          <Input
            className="modal__input"
            placeholder="Password"
            type="password"
            name={SignUpForm.Password}
            minLength={6}
            maxLength={40}
            required
            onInvalid={inputInvalidHandler}
            onChange={inputChnageHandler}
          />
          <span className="modal__invalid-message">Your password needs to be from 6 to 40 characters.</span>
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
          <a className="modal__message-link" href="#">
            Sign In
          </a>
          .
        </span>
      </div>
    </section>
  );
}
