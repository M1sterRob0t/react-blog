import { FormEvent, MouseEvent, useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Input, Typography, Button } from 'antd';
import { toast } from 'react-toastify';

import { AppRoute, errorToastConfig, successToastConfig } from '../../constants';
import { isFetchBaseQueryError, isErrorWithMessage } from '../../utils';
import { TNewArticleRequest } from '../../types/articles';
import { useGetArticleQuery, usePostNewArticleMutation } from '../../services/api';
import Spinner from '../Spinner';
import Error from '../Error';
import './style.css';

const { Title } = Typography;

interface ICreateNewPostProps {
  className: string;
  edit?: true;
}

function CreateNewPost(props: ICreateNewPostProps): JSX.Element {
  const { className, edit: isEdit } = props;
  const { slug = '' } = useParams();
  const { data, isError: isErrorGet, isLoading: isLoadingGet } = useGetArticleQuery(slug, { skip: Boolean(slug) });
  const article = data ? data.article : null;
  const [postNewArticle, { error, isLoading: isLoadingPost, isSuccess }] = usePostNewArticleMutation();

  const [title, setTitle] = useState(isEdit && article ? article.title : '');
  const [description, setDescription] = useState(isEdit && article ? article.description : '');
  const [body, setBody] = useState(isEdit && article ? article.body : '');
  const [tagList, setTags] = useState<string[]>(isEdit && article ? article.tagList : []);
  const [newTag, setNewTag] = useState('');

  function formSubmitHandler(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    if (!title.trim() || !description.trim() || !body.trim()) {
      setDescription(description.trim());
      setTitle(title.trim());
      setBody(body.trim());
      return;
    }

    const newArticle: TNewArticleRequest = {
      article: {
        title,
        description,
        body,
        tagList,
      },
    };

    //if (isEdit && article) dispatch(updateUserArticle({ newArticle, slug: article.slug }));
    //else postNewArticle(newArticle);
    postNewArticle(newArticle);
  }

  function addNewTagButtonClickHandler() {
    setTags((prevTags) => (newTag && !prevTags.includes(newTag) && newTag.trim() ? [...prevTags, newTag] : prevTags));
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

  useEffect(() => {
    setTitle(article?.title || '');
    setDescription(article?.description || '');
    setBody(article?.body || '');
    setTags(article?.tagList || []);
  }, [article]);

  if (isSuccess) {
    toast('The article has been successfully created!', successToastConfig);
    return <Navigate to={AppRoute.Articles} />;
  }
  if (isLoadingGet || isLoadingPost) return <Spinner />;
  if (isErrorGet) return <Error />;
  if (error) {
    if (isFetchBaseQueryError(error)) {
      const message = 'error' in error ? error.error : JSON.stringify(error.data);
      toast(message, errorToastConfig);
    } else if (isErrorWithMessage(error)) {
      toast(error.message, errorToastConfig);
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

export default CreateNewPost;
