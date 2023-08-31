import { FormEvent, MouseEvent, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Input, Typography, Button } from 'antd';
import './style.css';

import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { postNewArticle, updateUserArticle, fetchArticle } from '../../state/api-actions';
import { TNewArticleRequest } from '../../types/articles';
import { withLoading } from '../../hocs/withLoading';
import { withUpdate } from '../../hocs/withUpdate';

const { Title } = Typography;

interface ICreateNewPostProps {
  className: string;
  edit?: true;
}

function CreateNewPost(props: ICreateNewPostProps): JSX.Element {
  const { className, edit: isEdit } = props;
  const dispatch = useAppDispatch();
  const article = useAppSelector((state) => state.blog.article);

  const [title, setTitle] = useState(isEdit && article ? article.title : '');
  const [description, setDescription] = useState(isEdit && article ? article.description : '');
  const [body, setBody] = useState(isEdit && article ? article.body : '');
  const [tagList, setTags] = useState<string[]>(isEdit && article ? article.tagList : []);
  const [newTag, setNewTag] = useState('');
  const { name } = useParams();

  useEffect(() => {
    if (name && !article && isEdit) dispatch(fetchArticle(name));
  }, [name]);

  useEffect(() => {
    setTitle(article?.title || '');
    setDescription(article?.description || '');
    setBody(article?.body || '');
    setTags(article?.tagList || []);
  }, [article]);

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

    if (isEdit && article) dispatch(updateUserArticle({ newArticle, slug: article.slug }));
    else dispatch(postNewArticle(newArticle));
  }

  function addNewTagButtonClickHandler() {
    setTags((prevTags) => (newTag ? [...prevTags, newTag] : prevTags));
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
                style={{ color: 'rgba(0, 0, 0, 0.88)', backgroundColor: 'white' }}
                className="create-new-post__input create-new-post__input--tag"
                placeholder="Tag"
                value={tag}
                name={tag}
                disabled
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
export default withUpdate(withLoading<ICreateNewPostProps & JSX.IntrinsicAttributes>(CreateNewPost));
