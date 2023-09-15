import { MouseEvent, useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Input, Typography, Button } from 'antd';
import { toast } from 'react-toastify';
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

import { AppRoute, errorToastConfig, successToastConfig } from '../../constants';
import { isFetchBaseQueryError, isErrorWithMessage } from '../../utils';
import { useGetArticleQuery, usePostNewArticleMutation, usePutUpdatedArticleMutation } from '../../services/api';
import Spinner from '../Spinner';
import Error from '../Error';
import type { TNewArticleRequest } from '../../types/articles';
import type { TServerErrorResponse } from '../../types/registration';
import { withRedirect } from '../../hocs/withRedirect';
import './style.css';

const { Title } = Typography;
const INPUT_INVALID_CLASS = 'create-new-post__input--invalid';

const ArticleForm = {
  Title: 'title' as const,
  Description: 'description' as const,
  Body: 'body' as const,
  NewTag: 'newTag' as const,
};

const FieldErrors = {
  Title: {
    required: {
      type: 'required',
      message: 'Write a title for your post.',
    },
  },
  Description: {
    required: {
      type: 'required',
      message: 'Write a short description for your post.',
    },
  },
  Body: {
    required: {
      type: 'required',
      message: 'Write a text for your post.',
    },
  },
  NewTag: {
    noEmptyTags: {
      type: 'custom',
      message: 'You can not add an empty tag.',
    },
  },
};

type TArticalFormData = {
  title: string;
  body: string;
  description: string;
  newTag: string;
  addTagButton: string;
};

interface ICreateNewPostProps {
  className: string;
  edit?: true;
}

function CreateNewPost(props: ICreateNewPostProps): JSX.Element {
  const { className, edit: isEdit } = props;
  const { slug = '' } = useParams();

  const { data, isError: isErrorGet, isLoading: isLoadingGet } = useGetArticleQuery(slug, { skip: !isEdit });
  const article = data ? data.article : null;
  const [postNewArticle, { error: errorPost, isLoading: isLoadingPost, isSuccess: isSuccessPost }] =
    usePostNewArticleMutation();
  const [updateUserArticle, { error: errorPut, isLoading: isLoadingPut, isSuccess: isSuccessPut }] =
    usePutUpdatedArticleMutation();
  const error = errorPost || errorPut || null;
  const [tagList, setTags] = useState<string[]>(isEdit && article ? article.tagList : []);

  const {
    control,
    clearErrors,
    setValue,
    getValues,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<TArticalFormData>({
    defaultValues: {
      [ArticleForm.Title]: '',
      [ArticleForm.Description]: '',
      [ArticleForm.Body]: '',
      [ArticleForm.NewTag]: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  function addNewTagButtonClickHandler() {
    const newTag = getValues(ArticleForm.NewTag);
    if (newTag.trim().length === 0) {
      setError(ArticleForm.NewTag, FieldErrors.NewTag.noEmptyTags);
      setValue(ArticleForm.NewTag, '');
      return;
    }
    clearErrors(ArticleForm.NewTag);
    setTags((prevTags) => (newTag && !prevTags.includes(newTag) ? [...prevTags, newTag] : prevTags));
    setValue(ArticleForm.NewTag, '');
  }

  function clearNewTagButtonClickHandler() {
    setValue(ArticleForm.NewTag, '');
  }

  function deleteTagButtonClickHandler(evt: MouseEvent<HTMLButtonElement>) {
    const button = evt.currentTarget;
    const deletedTag = button.dataset.tag;
    if (deletedTag) {
      setTags((prevTags) => prevTags.filter((tag) => tag !== deletedTag));
    }
  }

  const formSubmitHandler: SubmitHandler<TArticalFormData> = (data) => {
    const { title, description, body } = data;

    if (!title.trim() || !description.trim() || !body.trim()) {
      setValue(ArticleForm.Title, title.trim());
      setValue(ArticleForm.Description, description.trim());
      setValue(ArticleForm.Body, body.trim());

      setError(ArticleForm.Title, FieldErrors.Title.required);
      setError(ArticleForm.Description, FieldErrors.Description.required);
      setError(ArticleForm.Body, FieldErrors.Body.required);
      return;
    }

    const newArticle: TNewArticleRequest = {
      article: {
        title: data.title,
        description: data.description,
        body: data.body,
        tagList,
      },
    };

    if (isEdit && article) updateUserArticle({ article: newArticle, slug: article.slug });
    else postNewArticle(newArticle);
  };

  useEffect(() => {
    if (isEdit && article) {
      setValue(ArticleForm.Title, article.title);
      setValue(ArticleForm.Description, article.description);
      setValue(ArticleForm.Body, article.body);
      setTags(article.tagList);
    }
  }, [article]);

  if (isSuccessPost || isSuccessPut) {
    const successMessage = isSuccessPost
      ? 'The article has been successfully created!'
      : 'The article has been successfully updated!';
    toast(successMessage, successToastConfig);
    return <Navigate to={AppRoute.Articles} />;
  }

  if (isLoadingGet || isLoadingPost || isLoadingPut || (isEdit && !article)) return <Spinner />;

  if (isErrorGet) return <Error />;

  if (error) {
    if (isFetchBaseQueryError(error)) {
      const serverErrorObj = error.data as TServerErrorResponse;
      const errorMessage = `Status: ${error.status}. ${serverErrorObj.errors.message}.`;
      toast(errorMessage, errorToastConfig);
    } else if (isErrorWithMessage(error)) {
      toast(error.message, errorToastConfig);
    }
  }

  return (
    <section className={`${className} create-new-post`}>
      <Title className="create-new-post__title" level={4}>
        {isEdit ? 'Edit article' : 'Create new article'}
      </Title>
      <form className="create-new-post__form" onSubmit={handleSubmit(formSubmitHandler)}>
        <label className="create-new-post__label">
          Title
          <Controller
            control={control}
            name={ArticleForm.Title}
            rules={{ required: 'Write a title for your post.' }}
            render={({ field }) => (
              <Input
                className={`create-new-post__input ${errors.title ? INPUT_INVALID_CLASS : ''}`}
                placeholder="Title"
                type="text"
                {...field}
              />
            )}
          />
          <span className="create-new-post__invalid-message">{errors.title && errors.title.message}</span>
        </label>
        <label className="create-new-post__label">
          Short description
          <Controller
            control={control}
            name={ArticleForm.Description}
            rules={{ required: 'Write a short description for your post.' }}
            render={({ field }) => (
              <Input
                className={`create-new-post__input ${errors.description ? INPUT_INVALID_CLASS : ''}`}
                placeholder="Short description"
                type="text"
                {...field}
              />
            )}
          />
          <span className="create-new-post__invalid-message">{errors.description && errors.description.message}</span>
        </label>
        <label className="create-new-post__label">
          Text
          <Controller
            control={control}
            name={ArticleForm.Body}
            rules={{ required: 'Write a text for your post.' }}
            render={({ field }) => (
              <Input.TextArea
                className={`create-new-post__input create-new-post__input--textarea ${
                  errors.body ? INPUT_INVALID_CLASS : ''
                }`}
                placeholder="Text"
                autoSize={{ minRows: 6 }}
                {...field}
              />
            )}
          />
          <span className="create-new-post__invalid-message">{errors.body && errors.body.message}</span>
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
            <label className="create-new-post__label">
              <Controller
                control={control}
                name={ArticleForm.NewTag}
                render={({ field }) => (
                  <Input
                    className={`create-new-post__input create-new-post__input--tag ${
                      errors.newTag ? INPUT_INVALID_CLASS : ''
                    }`}
                    placeholder="Tag"
                    {...field}
                  />
                )}
              />
              <div className="create-new-post__invalid-message">{errors.newTag && errors.newTag.message}</div>
            </label>
            <Button className="create-new-post__delete-tag-button" danger onClick={clearNewTagButtonClickHandler}>
              Delete
            </Button>
            <Button className="create-new-post__add-tag-button" onClick={addNewTagButtonClickHandler} htmlType="button">
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

export default withRedirect<ICreateNewPostProps & JSX.IntrinsicAttributes>(CreateNewPost);
