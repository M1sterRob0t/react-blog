import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './style.css';

const antIcon = <LoadingOutlined style={{ fontSize: 120 }} spin />;
function Spinner(): JSX.Element {
  return (
    <div className="spinner">
      <Spin className="spinner__inner" indicator={antIcon} data-testid="spinner" />
    </div>
  );
}

export default Spinner;
