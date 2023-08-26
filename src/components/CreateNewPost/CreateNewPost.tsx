import './style.css';
import { Input, Typography, Button } from 'antd';

interface ICreateNewPostProps {
  className: string;
  edit?: true;
}
const { Title } = Typography;

export default function CreateNewPost(props: ICreateNewPostProps): JSX.Element {
  const { className, edit } = props;

  return (
    <section className={`${className} create-new-post`}>
      <Title className="create-new-post__title" level={4}>
        {edit ? 'Edit article' : 'Create new article'}
      </Title>
      <form className="create-new-post__form">
        <label className="create-new-post__label">
          Title
          <Input className="create-new-post__input" placeholder="Title" />
        </label>
        <label className="create-new-post__label">
          Short description
          <Input className="create-new-post__input" placeholder="Short description" />
        </label>
        <label className="create-new-post__label">
          Text
          <Input.TextArea
            className="create-new-post__input create-new-post__input--textarea"
            placeholder="Text"
            autoSize={{ minRows: 6 }}
          />
        </label>
        <div className="create-new-post__tags">
          <label className="create-new-post__tag-label">Tags </label>
          <div className="create-new-post__tag-item">
            <Input
              className="create-new-post__input create-new-post__input--tag"
              placeholder="Tag"
              value={'programming'}
            />
            <Button className="create-new-post__delete-tag-button" danger>
              Delete
            </Button>
          </div>
          <div className="create-new-post__tag-item">
            <Input className="create-new-post__input create-new-post__input--tag" placeholder="Tag" />
            <Button className="create-new-post__delete-tag-button" danger>
              Delete
            </Button>
            <Button className="create-new-post__add-tag-button">Add tag</Button>
          </div>
        </div>
        <Button className="create-new-post__submit" type="primary">
          Send
        </Button>
      </form>
    </section>
  );
}
