import { FormEvent, MouseEvent, useState } from 'react';
import { Input, Typography, Button } from 'antd';
import './style.css';

import { useAppDispatch } from '../../hooks/hooks';
import { postNewArticle } from '../../state/api-actions';
import { TNewArticleRequest } from '../../types/articles';

const { Title } = Typography;

interface ICreateNewPostProps {
  className: string;
  edit?: true;
}
export default function CreateNewPost(props: ICreateNewPostProps): JSX.Element {
  const { className, edit: isEdit } = props;
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [tagList, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  function formSubmitHandler(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const newArticle: TNewArticleRequest = {
      article: {
        title,
        description,
        body,
        tagList,
      },
    };

    dispatch(postNewArticle(newArticle));
  }

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
      <form className="create-new-post__form" onSubmit={formSubmitHandler}>
        <label className="create-new-post__label">
          Title
          <Input
            className="create-new-post__input"
            placeholder="Title"
            type="text"
            required
            value={title}
            onChange={(evt) => setTitle(evt.target.value)}
          />
        </label>
        <label className="create-new-post__label">
          Short description
          <Input
            className="create-new-post__input"
            placeholder="Short description"
            type="text"
            required
            value={description}
            onChange={(evt) => setDescription(evt.target.value)}
          />
        </label>
        <label className="create-new-post__label">
          Text
          <Input.TextArea
            className="create-new-post__input create-new-post__input--textarea"
            placeholder="Text"
            autoSize={{ minRows: 6 }}
            required
            value={body}
            onChange={(evt) => setBody(evt.target.value)}
          />
        </label>
        <div className="create-new-post__tags">
          <label className="create-new-post__tag-label">Tags </label>
          {tagList.map((tag) => (
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
