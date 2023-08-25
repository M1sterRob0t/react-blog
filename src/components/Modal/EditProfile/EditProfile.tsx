import '../style.css';
import { Input, Typography, Button } from 'antd';

interface IEditProfileProps {
  className: string;
}
const { Title } = Typography;

export default function EditProfile(props: IEditProfileProps): JSX.Element {
  const { className } = props;

  return (
    <section className={`${className} modal`}>
      <Title level={4} className="modal__title">
        Edit Profile
      </Title>
      <form className="modal__form">
        <label className="modal__label">
          Username
          <Input className="modal__input" placeholder="Username" value={'John Doe'} />
        </label>

        <label className="modal__label">
          Email address
          <Input className="modal__input" placeholder="Email address" value={'john@example.com'} />
        </label>

        <label className="modal__label">
          New password
          <Input className="modal__input" placeholder="New password" />
        </label>

        <label className="modal__label">
          Avatar image (url)
          <Input className="modal__input" placeholder="Avatar image" />
        </label>

        <Button className="modal__submit" type="primary">
          Save
        </Button>
      </form>
    </section>
  );
}
