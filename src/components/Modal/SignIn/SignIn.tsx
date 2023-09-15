import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import '../style.css';
import { Input, Typography, Button } from 'antd';
import { toast } from 'react-toastify';
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

import { usePostExistingUserMutation } from '../../../services/api';
import Spinner from '../../Spinner';
import { addUserAction } from '../../../state/userReducer';
import { isFetchBaseQueryError, isErrorWithMessage } from '../../../utils';
import { AppRoute, errorToastConfig, successToastConfig, INPUT_INVALID_CLASS } from '../../../constants';
import { useAppDispatch } from '../../../hooks/hooks';
import type { TUserLoginRequest } from '../../../types/users';
import type { TServerErrorResponse } from '../../../types/registration';
import { withRedirect } from '../../../hocs/withRedirect';

const { Title } = Typography;

const SignInForm = {
  Email: 'email' as const,
  Password: 'password' as const,
};

type TSignInFormData = {
  email: string;
  password: string;
};

interface ISignInProps {
  className: string;
}

function SignIn(props: ISignInProps): JSX.Element {
  const { className } = props;
  const [requireLogin, { isLoading, isSuccess, isError, error, data }] = usePostExistingUserMutation();
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TSignInFormData>();

  useEffect(() => {
    if (isSuccess && data) {
      toast('You successfully logged in!', successToastConfig);
      dispatch(addUserAction(data.user));
    }
  }, [isSuccess]);

  if (isLoading) return <Spinner />;

  if (isSuccess) return <Navigate to={AppRoute.Articles} />;

  if (isError && error) {
    if ('status' in error && error.status === 422) {
      const message = 'Email or password is incorrect.';
      toast(message, errorToastConfig);
    } else if (isFetchBaseQueryError(error)) {
      const serverErrorObj = error.data as TServerErrorResponse;
      const errorMessage = `Status: ${error.status}. ${serverErrorObj.errors.message}.`;
      toast(errorMessage, errorToastConfig);
    } else if (isErrorWithMessage(error)) {
      toast(error.message, errorToastConfig);
    }
  }
  const formSubmitHandler: SubmitHandler<TSignInFormData> = (data) => {
    const user: TUserLoginRequest = { user: { email: data.email, password: data.password } };
    requireLogin(user);
  };

  return (
    <section className={`${className} modal`}>
      <Title level={4} className="modal__title">
        Sign In
      </Title>
      <form className="modal__form" onSubmit={handleSubmit(formSubmitHandler)}>
        <label className="modal__label">
          Email address
          <Controller
            name={SignInForm.Email}
            control={control}
            rules={{ required: 'Please, write your password.' }}
            render={({ field }) => (
              <Input
                className={`modal__input ${errors.email ? INPUT_INVALID_CLASS : ''}`}
                placeholder="Email address"
                type="email"
                {...field}
              />
            )}
          />
          <span className="modal__invalid-message">{errors.email && errors.email.message}</span>
        </label>

        <label className="modal__label">
          Password
          <Controller
            name={SignInForm.Password}
            control={control}
            rules={{ required: 'Please, write your password.' }}
            render={({ field }) => (
              <Input
                className={`modal__input ${errors.email ? INPUT_INVALID_CLASS : ''}`}
                placeholder="Password"
                type="password"
                {...field}
              />
            )}
          />
          <span className="modal__invalid-message">{errors.password && errors.password.message}</span>
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

export default withRedirect<ISignInProps & JSX.IntrinsicAttributes>(SignIn);
