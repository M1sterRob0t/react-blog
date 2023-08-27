import '../style.css';
import { Input, Typography, Button } from 'antd';

interface ISignUpProps {
  className: string;
}
const { Title } = Typography;

export default function SignUp(props: ISignUpProps): JSX.Element {
  const { className } = props;
  return (
    <section className={`${className} modal`}>
      <Title level={4} className="modal__title">
        Create new account
      </Title>
      <form className="modal__form">
        <label className="modal__label">
          Username
          <Input className="modal__input" placeholder="Username" />
        </label>

        <label className="modal__label">
          Email address
          <Input className="modal__input" placeholder="Email address" />
        </label>

        <label className="modal__label">
          Password
          <Input className="modal__input" placeholder="Password" />
        </label>

        <label className="modal__label">
          Repeat Password
          <Input className="modal__input" placeholder="Password" />
        </label>
        <label className="modal__checkbox-label">
          <Input className="modal__checkbox" type="checkbox" checked />
          <span>I agree to the processing of my personal information</span>
        </label>
        <Button className="modal__submit" type="primary">
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
