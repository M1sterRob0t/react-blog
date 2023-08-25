import './style.css';
import { Input, Typography, Button } from 'antd';

interface ISignUpProps {
  className: string;
}
const { Title } = Typography;

export default function SignUp(props: ISignUpProps): JSX.Element {
  const { className } = props;
  return (
    <section className={`${className} sign-up`}>
      <Title level={4} className="sign-up__title">
        Create new account
      </Title>
      <form className="sign-up__form">
        <label className="sign-up__label">
          Username
          <Input className="sign-up__input" placeholder="Username" />
        </label>

        <label className="sign-up__label">
          Email address
          <Input className="sign-up__input" placeholder="Email address" />
        </label>

        <label className="sign-up__label">
          Password
          <Input className="sign-up__input" placeholder="Password" />
        </label>

        <label className="sign-up__label">
          Repeat Password
          <Input className="sign-up__input" placeholder="Password" />
        </label>
        <label className="sign-up__checkbox-label">
          <Input className="sign-up__checkbox" type="checkbox" checked />
          <span>I agree to the processing of my personal information</span>
        </label>
        <Button className="sign-up__submit" type="primary">
          Create
        </Button>
      </form>
      <div className="sign-up__message">
        <span className="sign-up__message-text">
          Already have an account?
          <a className="sign-up__message-link" href="#">
            Sign In
          </a>
          .
        </span>
      </div>
    </section>
  );
}
