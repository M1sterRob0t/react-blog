import { Space, Typography } from 'antd';

import ErrorImage from './image/sad-cat.png';

const { Title, Text } = Typography;

function Error(): JSX.Element {
  return (
    <Space direction="vertical" style={{ width: '100%', height: '65vh', textAlign: 'center', marginTop: '200px' }}>
      <Title level={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
        <img src={ErrorImage} width="50" height="50" />
        Oops!
      </Title>
      <Text style={{ fontSize: '23px' }}>Sorry, an unexpected error has occured.</Text>
      <Text style={{ color: 'grey', fontSize: '18px' }}>Not Found</Text>
    </Space>
  );
}

export default Error;
