import { Space, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { AppRoute } from '../../constants';
import './style.css';

import ErrorImage from './image/sad-cat.png';

const { Title, Text } = Typography;

function NotFound(): JSX.Element {
  return (
    <Space className="not-found" direction="vertical">
      <Title className="not-found__title" level={1}>
        <img src={ErrorImage} width="50" height="50" style={{ marginRight: '10px' }} />
        404. Page not found...
      </Title>
      <Text className="not-found__message-additional">
        Go to <Link to={AppRoute.Root}>Main Page</Link>
      </Text>
    </Space>
  );
}

export default NotFound;
