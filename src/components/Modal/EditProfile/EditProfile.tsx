import { FormEvent, useState } from 'react';
import { Input, Typography, Button } from 'antd';
import { toast } from 'react-toastify';

import { successToastConfig, INPUT_INVALID_CLASS } from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { postUpdatedUser } from '../../../state/api-actions';
import { TUserEditRequest } from '../../../types/users';
import '../style.css';
import { clearErrorAction } from '../../../state/reducer';
import { withLoading } from '../../../hocs/withLoading';

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
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.blog.user);
  const error = useAppSelector((state) => state.blog.error);

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
      dispatch(postUpdatedUser(updatedUser));
    } else {
      toast('Successfully saved!', successToastConfig);
      dispatch(clearErrorAction());
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

  return (
    <section className={`${className} modal`}>
      <Title level={4} className="modal__title">
        Edit Profile
      </Title>
      <form className="modal__form" onSubmit={formSubmitHandler}>
        <label className="modal__label">
          Username
          <Input
            className={`modal__input ${error && error.username ? INPUT_INVALID_CLASS : ''}`}
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
            Username {error?.username || 'needs to be from 3 to 20 characters.'}
          </span>
        </label>

        <label className="modal__label">
          Email address
          <Input
            className={`modal__input ${error && error.email ? INPUT_INVALID_CLASS : ''}`}
            placeholder="Email address"
            type="email"
            name={EditForm.Email}
            required
            onInvalid={inputInvalidHandler}
            defaultValue={editFrom.email}
            onChange={inputChnageHandler}
          />
          <span className="modal__invalid-message">{`Email ${error?.email || 'needs to be correct.'}`}</span>
        </label>

        <label className="modal__label">
          New password
          <Input
            className={`modal__input ${error && error.password ? INPUT_INVALID_CLASS : ''}`}
            placeholder="New password"
            type="password"
            name={EditForm.Password}
            minLength={6}
            maxLength={40}
            onInvalid={inputInvalidHandler}
            onChange={inputChnageHandler}
          />
          <span className="modal__invalid-message">{`Password ${
            error?.password || 'needs to be from 6 to 40 characters.'
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

export default withLoading<IEditProfileProps & JSX.IntrinsicAttributes>(EditProfile);
