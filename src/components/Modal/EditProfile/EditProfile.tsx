import { Navigate } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import { Input, Typography, Button } from 'antd';
import { toast } from 'react-toastify';

import { AppRoute, successToastConfig, errorToastConfig, INPUT_INVALID_CLASS } from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import '../style.css';
import { usePutUpdatedUserMutation } from '../../../services/api';
import Spinner from '../../Spinner';
import { isFetchBaseQueryError, isErrorWithMessage, processServerError } from '../../../utils';
import { addUserAction } from '../../../state/userReducer';
import type { TUserEditRequest } from '../../../types/users';
import type { TServerErrorResponse } from '../../../types/registration';

const EditForm = {
  Username: 'username',
  Email: 'email',
  Password: 'password',
  Image: 'image',
};

interface IEditProfileProps {
  className: string;
}
const { Title } = Typography;

function EditProfile(props: IEditProfileProps): JSX.Element {
  const { className } = props;
  const user = useAppSelector((state) => state.userInfo.user);
  const dispatch = useAppDispatch();
  const [updateUser, { isLoading, isSuccess, isError, error, data }] = usePutUpdatedUserMutation();
  const serverError = processServerError(error);

  const editFormDefault = {
    username: user?.username,
    email: user?.email,
    image: user?.image,
  };

  const [editFrom, setFormInfo] = useState(editFormDefault);

  function formSubmitHandler(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const form = evt.target as HTMLFormElement;
    const formData = new FormData(form);

    const username = formData.get(EditForm.Username) as string;
    const email = formData.get(EditForm.Email) as string;
    const newPassword = formData.get(EditForm.Password) as string;
    const image = (formData.get(EditForm.Image) as string) || null;

    const updatedUser: TUserEditRequest = { user: { email, image, username, newPassword } };

    if (!newPassword) delete updatedUser.user.newPassword;
    if (!image) delete updatedUser.user.image;
    if (user && user.username === username) delete updatedUser.user.username;
    if (user && user.email === email) delete updatedUser.user.email;
    if (user && user.image === image) delete updatedUser.user.image;

    const isUpdateRequired = Boolean(Object.keys(updatedUser.user).length);

    if (isUpdateRequired) {
      setFormInfo({ username, email, image });
      updateUser(updatedUser);
    } else {
      toast('Successfully saved!', successToastConfig);
    }
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

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(addUserAction(data.user));
      toast('Successfully updated!', successToastConfig);
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

  return (
    <section className={`${className} modal`}>
      <Title level={4} className="modal__title">
        Edit Profile
      </Title>
      <form className="modal__form" onSubmit={formSubmitHandler}>
        <label className="modal__label">
          Username
          <Input
            className={`modal__input ${serverError.username ? INPUT_INVALID_CLASS : ''}`}
            placeholder="Username"
            type="text"
            name={EditForm.Username}
            minLength={3}
            maxLength={20}
            required
            onInvalid={inputInvalidHandler}
            defaultValue={editFrom.username}
            onChange={inputChnageHandler}
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
            type="email"
            name={EditForm.Email}
            required
            onInvalid={inputInvalidHandler}
            defaultValue={editFrom.email}
            onChange={inputChnageHandler}
          />
          <span className="modal__invalid-message">{`Email ${serverError.email || 'needs to be correct.'}`}</span>
        </label>

        <label className="modal__label">
          New password
          <Input
            className={`modal__input ${serverError.password ? INPUT_INVALID_CLASS : ''}`}
            placeholder="New password"
            type="password"
            name={EditForm.Password}
            minLength={6}
            maxLength={40}
            onInvalid={inputInvalidHandler}
            onChange={inputChnageHandler}
          />
          <span className="modal__invalid-message">{`Password ${
            serverError.password || 'needs to be from 6 to 40 characters.'
          }`}</span>
        </label>

        <label className="modal__label">
          Avatar image (url)
          <Input
            className="modal__input"
            placeholder="Avatar image"
            type="url"
            name={EditForm.Image}
            onInvalid={inputInvalidHandler}
            defaultValue={editFrom.image || ''}
            onChange={inputChnageHandler}
          />
          <span className="modal__invalid-message">Image needs to be correct url.</span>
        </label>

        <Button className="modal__submit" type="primary" htmlType="submit">
          Save
        </Button>
      </form>
    </section>
  );
}

export default EditProfile;
