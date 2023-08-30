import { Space, Typography } from 'antd';

import './style.css';
import ErrorImage from './image/sad-cat.png';

const { Title, Text } = Typography;

function Error(): JSX.Element {
  return (
    <Space className="error" direction="vertical">
      <Title className="error__title" level={1}>
        <img src={ErrorImage} width="50" height="50" />
        Oops!
      </Title>
      <Text className="error__message-main">Sorry, an unexpected error has occured.</Text>
      <Text className="error__message-additional">Not Found</Text>
    </Space>
  );
}

export default Error;
