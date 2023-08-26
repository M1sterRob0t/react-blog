import './style.css';
import { HeartOutlined } from '@ant-design/icons';
import { Tag, Button, message, Popconfirm } from 'antd';

import defaultAvatar from './images/default-avatar.png';

interface IPostProps {
  full?: true;
  authorized?: true;
}

export default function Post(props: IPostProps) {
  const { full, authorized } = props;

  const onConfirm = (e: React.MouseEvent<HTMLElement> | undefined): void => {
    console.log(e);
    message.success('Click on Yes');
  };

  const onCancel = (e: React.MouseEvent<HTMLElement> | undefined): void => {
    console.log(e);
    message.error('Click on No');
  };

  return (
    <article className={`post ${full && 'post--full'}`}>
      <div className="post__header">
        <h2 className="post__title">Some article title </h2>
        <span className="post__likes">
          <span className="post__likes-icon">
            <HeartOutlined />
          </span>
          <span className="post__likes-count">12</span>
        </span>
      </div>
      <div className="post__info">
        <div className="post__info-container">
          <div className="post__details">
            <div className="post__user-name">John Doe</div>
            <div className="post__date">March 5, 2020 </div>
          </div>
          <div className="post__user-avatar">
            <img src={defaultAvatar} width="46" height="46px" alt="user avatar" />
          </div>
        </div>
        {authorized && (
          <div className="post__info-controls">
            <Popconfirm
              className="post__popconfirm"
              title="Are you sure to delete this article?"
              onConfirm={onConfirm}
              onCancel={onCancel}
              okText="Yes"
              cancelText="No"
              placement="rightTop"
            >
              <Button className="post__delit-button" danger>
                Delete
              </Button>
            </Popconfirm>
            <Button className="post__edit-button">Edit</Button>
          </div>
        )}
      </div>
      <div className="post__desc">
        <div className="post__tegs-list">
          <Tag className="post__tegs-item">Tag1</Tag>
          <Tag className="post__tegs-item">Some tag</Tag>
        </div>
        <p className="post__desc-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat.
        </p>
      </div>
      {full && (
        <div className="post__body">
          <h3 className="post__body-main-title">Est Ampyciden pater patent</h3>
          <h3 className="post__body-subtitle">Amor saxa inpiger</h3>
          <p className="post__body-paragraph">
            Lorem markdownum Stygias neque is referam fudi, breve per. Et Achaica tamen: nescia ista occupat, illum se
            ad potest humum et.
          </p>

          <h3 className="post__body-subtitle">Qua deos has fontibus</h3>
          <p className="post__body-paragraph">
            Recens nec ferro responsaque dedere armenti opes momorderat pisce, vitataque et fugisse. Et iamque
            incipiens, qua huius suo omnes ne pendentia citus pedum.
          </p>

          <h3 className="post__body-subtitle">Quamvis pronuba</h3>
          <p className="post__body-paragraph">
            Ulli labore facta. Io cervis non nosterque nullae, vides: aethere Delphice subit, tamen Romane ob cubilia
            Rhodopen calentes librata! Nihil populorum flava, inrita? Sit hic nunc, hoc formae Esse illo? Umeris eram
            similis, crudelem de est relicto ingemuit finiat Pelia uno cernunt Venus draconem, hic, Methymnaeae.
          </p>

          <ol className="post__body-list">
            <li className="post__body-list-item">Clamoribus haesit tenentem iube Haec munera</li>
            <li className="post__body-list-item">Vincla venae</li>
            <li className="post__body-list-item"> Paris includere etiam tamen</li>
            <li className="post__body-list-item">Superi te putria imagine Deianira</li>
            <li className="post__body-list-item">Tremore hoste Esse sed perstat capillis siqua</li>
          </ol>
        </div>
      )}
    </article>
  );
}
