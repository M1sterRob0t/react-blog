import { Alert, Space } from 'antd';

interface IPopupProps {
  name?: string;
  message?: string;
}

function Error({ name = 'Error', message = '' }: IPopupProps): JSX.Element {
  return (
    <Space direction="vertical" style={{ width: 500, height: 200, margin: '35vh auto' }}>
      <Alert type="error" showIcon message={name} description={message} style={{ transform: 'scale(1.4)' }} />
    </Space>
  );
}

export default Error;
