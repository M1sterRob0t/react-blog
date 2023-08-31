import { MouseEvent, useState } from 'react';
import './style.css';
import { Input, Typography, Button } from 'antd';

interface ICreateNewPostProps {
  className: string;
  edit?: true;
}
const { Title } = Typography;

export default function CreateNewPost(props: ICreateNewPostProps): JSX.Element {
  const { className, edit: isEdit } = props;
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  function addNewTagButtonClickHandler() {
    setTags((prevTags) => [...prevTags, newTag]);
    setNewTag('');
  }

  function clearNewTagButtonClickHandler() {
    setNewTag('');
  }

  function deleteTagButtonClickHandler(evt: MouseEvent<HTMLButtonElement>) {
    const button = evt.currentTarget;
    const deletedTag = button.dataset.tag;
    if (deletedTag) {
      setTags((prevTags) => prevTags.filter((tag) => tag !== deletedTag));
    }
  }

  return (
    <section className={`${className} create-new-post`}>
      <Title className="create-new-post__title" level={4}>
        {isEdit ? 'Edit article' : 'Create new article'}
      </Title>
      <form className="create-new-post__form">
        <label className="create-new-post__label">
          Title
          <Input className="create-new-post__input" placeholder="Title" type="text" required />
        </label>
        <label className="create-new-post__label">
          Short description
          <Input className="create-new-post__input" placeholder="Short description" type="text" required />
        </label>
        <label className="create-new-post__label">
          Text
          <Input.TextArea
            className="create-new-post__input create-new-post__input--textarea"
            placeholder="Text"
            autoSize={{ minRows: 6 }}
            required
          />
        </label>
        <div className="create-new-post__tags">
          <label className="create-new-post__tag-label">Tags </label>
          {tags.map((tag) => (
            <div className="create-new-post__tag-item" key={tag}>
              <Input
                className="create-new-post__input create-new-post__input--tag"
                placeholder="Tag"
                value={tag}
                name={tag}
              />
              <Button
                className="create-new-post__delete-tag-button"
                data-tag={tag}
                danger
                onClick={deleteTagButtonClickHandler}
              >
                Delete
              </Button>
            </div>
          ))}
          <div className="create-new-post__tag-item">
            <Input
              className="create-new-post__input create-new-post__input--tag"
              placeholder="Tag"
              value={newTag}
              onChange={(evt) => setNewTag(evt.target.value)}
            />
            <Button className="create-new-post__delete-tag-button" danger onClick={clearNewTagButtonClickHandler}>
              Delete
            </Button>
            <Button className="create-new-post__add-tag-button" onClick={addNewTagButtonClickHandler}>
              Add tag
            </Button>
          </div>
        </div>
        <Button className="create-new-post__submit" type="primary" htmlType="submit">
          Send
        </Button>
      </form>
    </section>
  );
}
