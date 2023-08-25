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
        Sign In
      </Title>
      <form className="modal__form">
        <label className="modal__label">
          Email address
          <Input className="modal__input" placeholder="Email address" />
        </label>

        <label className="modal__label">
          Password
          <Input className="modal__input" placeholder="Password" />
        </label>

        <Button className="modal__submit" type="primary">
          Login
        </Button>
      </form>
      <div className="modal__message">
        <span className="modal__message-text">
          Don’t have an account?
          <a className="modal__message-link" href="#">
            Sign Up
          </a>
          .
        </span>
      </div>
    </section>
  );
}
