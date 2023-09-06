import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Input, Typography, Button } from 'antd';
import { toast } from 'react-toastify';
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

import { AppRoute, successToastConfig, errorToastConfig, INPUT_INVALID_CLASS } from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import '../style.css';
import { usePutUpdatedUserMutation } from '../../../services/api';
import Spinner from '../../Spinner';
import { isFetchBaseQueryError, isErrorWithMessage, processServerError } from '../../../utils';
import { addUserAction } from '../../../state/userReducer';
import type { TUserEditRequest } from '../../../types/users';
import type { TServerErrorResponse } from '../../../types/registration';

const { Title } = Typography;
const EditForm = {
  Username: 'username' as const,
  Email: 'email' as const,
  Password: 'password' as const,
  Image: 'image' as const,
};

type TEditFormData = {
  password?: string;
  email?: string;
  username?: string;
  image?: string;
};

interface IEditProfileProps {
  className: string;
}

function EditProfile(props: IEditProfileProps): JSX.Element {
  const { className } = props;
  const user = useAppSelector((state) => state.userInfo.user);
  const dispatch = useAppDispatch();
  const [updateUser, { isLoading, isSuccess, isError, error, data }] = usePutUpdatedUserMutation();
  const serverError = processServerError(error);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TEditFormData>({
    defaultValues: {
      username: user ? user.username : '',
      email: user ? user.email : '',
      password: '',
      image: user && user.image ? user.image : '',
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(addUserAction(data.user));
      toast('Your profile successfully updated!', successToastConfig);
    }
  }, [isSuccess]);

  if (isLoading) return <Spinner />;

  if (isSuccess) return <Navigate to={AppRoute.Articles} />;

  if (isError) {
    if (isFetchBaseQueryError(error) && error.status !== 422) {
      const serverErrorObj = error.data as TServerErrorResponse;
      const errorMessage = `Status: ${error.status}. ${serverErrorObj.errors.message}.`;
      toast(errorMessage, errorToastConfig);
    } else if (isErrorWithMessage(error)) {
      toast(error.message, errorToastConfig);
    }
  }

  const formSubmitHandler: SubmitHandler<TEditFormData> = (data) => {
    const { username, email, password, image } = data;
    const updatedUser: TUserEditRequest = { user: { email, image, username, password } };

    if (!password) delete updatedUser.user.password;
    if (!image) delete updatedUser.user.image;
    if (user && user.username === username) delete updatedUser.user.username;
    if (user && user.email === email) delete updatedUser.user.email;
    if (user && user.image === image) delete updatedUser.user.image;

    const isUpdateRequired = Boolean(Object.keys(updatedUser.user).length);

    if (isUpdateRequired) {
      updateUser(updatedUser);
    } else {
      navigate(AppRoute.Root);
    }
  };

  return (
    <section className={`${className} modal`}>
      <Title level={4} className="modal__title">
        Edit Profile
      </Title>
      <form className="modal__form" onSubmit={handleSubmit(formSubmitHandler)}>
        <label className="modal__label">
          Username
          <Controller
            name={EditForm.Username}
            control={control}
            rules={{
              required: 'Please, write your name.',
              minLength: { value: 3, message: 'Minimum length 3 characters.' },
              maxLength: { value: 20, message: 'Maximum length 20 characters.' },
            }}
            render={({ field }) => (
              <Input
                className={`modal__input ${errors.username || serverError.username ? INPUT_INVALID_CLASS : ''}`}
                placeholder="Username"
                type="text"
                {...field}
              />
            )}
          />
          <span className="modal__invalid-message">
            {errors.username && (errors.username.message || 'Username needs to be from 3 to 20 characters. ')}
            {!errors.username && serverError.username && `Username ${serverError.username}.`}
          </span>
        </label>

        <label className="modal__label">
          Email address
          <Controller
            name={EditForm.Email}
            control={control}
            rules={{ required: 'Please, write your email.' }}
            render={({ field }) => (
              <Input
                className={`modal__input ${errors.email || serverError.email ? INPUT_INVALID_CLASS : ''}`}
                placeholder="Email address"
                type="email"
                {...field}
              />
            )}
          />
          <span className="modal__invalid-message">
            {errors.email && (errors.email.message || 'Email needs to be correct. ')}
            {!errors.email && serverError.email && `Email ${serverError.email}`}
          </span>
        </label>

        <label className="modal__label">
          New password
          <Controller
            name={EditForm.Password}
            control={control}
            rules={{
              minLength: { value: 6, message: 'Minimum length 6 characters.' },
              maxLength: { value: 40, message: 'Maximum length 40 characters.' },
            }}
            render={({ field }) => (
              <Input
                className={`modal__input ${errors.password || serverError.password ? INPUT_INVALID_CLASS : ''}`}
                placeholder="Password"
                type="password"
                {...field}
              />
            )}
          />
          <span className="modal__invalid-message">
            {errors.password && (errors.password.message || 'Password needs to be from 6 to 40 characters. ')}
            {!errors.password && serverError.password && `Password ${serverError.password}.`}
          </span>
        </label>

        <label className="modal__label">
          Avatar image (url)
          <Controller
            name={EditForm.Image}
            control={control}
            rules={{}}
            render={({ field }) => <Input className="modal__input" placeholder="Avatar image" type="url" {...field} />}
          />
          <span className="modal__invalid-message">
            {errors.image && (errors.image.message || 'Image needs to be correct url. ')}
          </span>
        </label>

        <Button className="modal__submit" type="primary" htmlType="submit">
          Save
        </Button>
      </form>
    </section>
  );
}

export default EditProfile;
