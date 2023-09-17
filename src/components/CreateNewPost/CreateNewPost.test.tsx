import { Provider } from 'react-redux';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import { rest } from 'msw';
import { act } from 'react-dom/test-utils';

import { AppRoute, BASE_URL } from '../../constants';
import { mockArticlesResponse } from '../../mock/mockArticles';
import { store } from '../../state/store';
import { server } from '../../mock/mockServiceWorker';
import { api } from '../../services/api';
import { mockUser } from '../../mock/mockUser';
import { addUserAction, removeUserAction } from '../../state/userReducer';
import Posts from '../Posts';

import CreateNewPost from './CreateNewPost';

const mockArticles = mockArticlesResponse.articles;
const mockArticle = mockArticles[5];
const mockUrl = `${AppRoute.Articles}/${mockArticle.slug}/edit`;

describe('Component: CreateNewPost', () => {
  beforeEach(() => {
    act(() => {
      store.dispatch(addUserAction(mockUser));
    });
  });

  test('should render correctly when user create an article', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.NewArticle]}>
          <Routes>
            <Route path={AppRoute.NewArticle} element={<CreateNewPost />} />
            <Route path={AppRoute.Login} element={<h1>Login Page</h1>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/Create new article/i)).toBeInTheDocument();

    expect(screen.getByText(/Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Short description/i)).toBeInTheDocument();
    expect(screen.getByText(/Text/i)).toBeInTheDocument();
    expect(screen.getByText(/Tags/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/Title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Short description/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Text/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Tag/i)).toBeInTheDocument();

    expect(screen.getByText(/send/i)).toBeInTheDocument();
    expect(screen.getByText(/add tag/i)).toBeInTheDocument();
    expect(screen.getByText(/delete/i)).toBeInTheDocument();
  });

  test('should render correctly when user edit an article', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockUrl]}>
          <Routes>
            <Route path={AppRoute.EditArticle} element={<CreateNewPost edit />} />
            <Route path={AppRoute.Login} element={<h1>Login Page</h1>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText(/Edit article/i)).toBeInTheDocument();

      expect(screen.getByText(/Title/i)).toBeInTheDocument();
      expect(screen.getByText(/Short description/i)).toBeInTheDocument();
      expect(screen.getByText(/Text/i)).toBeInTheDocument();
      expect(screen.getByText(/Tags/i)).toBeInTheDocument();

      expect(screen.getByDisplayValue(mockArticle.title)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockArticle.description)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockArticle.body)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockArticle.tagList[0])).toBeInTheDocument();
    });
  });

  test('should show Spinner while data is loading', async () => {
    store.dispatch(api.util.invalidateTags(['Articles', 'Article']));
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockUrl]}>
          <Routes>
            <Route path={AppRoute.EditArticle} element={<CreateNewPost edit />} />
            <Route path={AppRoute.Login} element={<h1>Login Page</h1>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId(/spinner/i)).toBeInTheDocument();
  });

  test('should render Error when server response status is not 200', async () => {
    store.dispatch(api.util.invalidateTags(['Articles', 'Article']));

    server.use(
      rest.get(`${BASE_URL}${AppRoute.Article}`, (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Internal Server Error' }));
      })
    );

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockUrl]}>
          <Routes>
            <Route path={AppRoute.EditArticle} element={<CreateNewPost edit />} />
            <Route path={AppRoute.Login} element={<h1>Login Page</h1>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText(/oops/i)).toBeInTheDocument();
      expect(screen.queryByText(/Not Found/i)).toBeInTheDocument();
    });
  });

  test('should redirect to the Login Page if user is not authorized', async () => {
    store.dispatch(removeUserAction());

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockUrl]}>
          <Routes>
            <Route path={AppRoute.EditArticle} element={<CreateNewPost edit />} />
            <Route path={AppRoute.Login} element={<h1>Login Page</h1>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Login Page/i)).toBeInTheDocument();
  });

  test('should dispaly values when user type in fields', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.NewArticle]}>
          <Routes>
            <Route path={AppRoute.NewArticle} element={<CreateNewPost />} />
            <Route path={AppRoute.Login} element={<h1>Login Page</h1>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      await userEvent.type(screen.getByPlaceholderText(/Title/i), 'my title');
      await userEvent.type(screen.getByPlaceholderText(/Short description/i), 'my short desc');
      await userEvent.type(screen.getByPlaceholderText(/Text/i), 'my post');
      await userEvent.type(screen.getByPlaceholderText(/Tag/i), 'my tag');
    });

    expect(screen.getByDisplayValue('my title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('my short desc')).toBeInTheDocument();
    expect(screen.getByDisplayValue('my post')).toBeInTheDocument();
    expect(screen.getByDisplayValue('my tag')).toBeInTheDocument();
  });

  test('should add new tag when user click add tag button', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.NewArticle]}>
          <Routes>
            <Route path={AppRoute.NewArticle} element={<CreateNewPost />} />
            <Route path={AppRoute.Login} element={<h1>Login Page</h1>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/Create new article/i)).toBeInTheDocument();

    await act(async () => {
      await userEvent.type(screen.getByPlaceholderText('Tag'), 'first');
      await userEvent.click(screen.getByText(/add tag/i));
    });
    await act(async () => {
      await userEvent.type(screen.getAllByPlaceholderText('Tag')[1], 'second');
      await userEvent.click(screen.getByText(/add tag/i));
    });

    expect(await screen.findByDisplayValue('first')).toBeInTheDocument();
    expect(await screen.findByDisplayValue('second')).toBeInTheDocument();
  });

  test('should remove tag when user click remove tag button', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockUrl]}>
          <Routes>
            <Route path={AppRoute.EditArticle} element={<CreateNewPost edit />} />
            <Route path={AppRoute.Login} element={<h1>Login Page</h1>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    await waitFor(async () => {
      expect(screen.getByText(/Edit article/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockArticle.tagList[0])).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockArticle.tagList[1])).toBeInTheDocument();
      await userEvent.click(screen.getAllByText('Delete')[0]);
      await userEvent.click(screen.getAllByText('Delete')[0]);
      expect(screen.queryByDisplayValue(mockArticle.tagList[0])).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue(mockArticle.tagList[1])).not.toBeInTheDocument();
    });
  });

  test('should send new article to the server and redirect to the Articles Page when user click send button', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.NewArticle]}>
          <Routes>
            <Route path={AppRoute.NewArticle} element={<CreateNewPost />} />
            <Route path={AppRoute.Articles} element={<Posts />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await act(async () => {
      await userEvent.type(screen.getByPlaceholderText(/Title/i), 'my title');
      await userEvent.type(screen.getByPlaceholderText(/Short description/i), 'my short desc');
      await userEvent.type(screen.getByPlaceholderText(/Text/i), 'my post');
      await userEvent.type(screen.getByPlaceholderText(/Tag/i), 'my tag');
      await userEvent.click(screen.getByText(/add tag/i));
    });
    await userEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(await screen.findByText('my title')).toBeInTheDocument();
    expect(await screen.findByText('my short desc')).toBeInTheDocument();
    expect(await screen.findByText('my tag')).toBeInTheDocument();
  });

  test('should send updated article to the server and redirect to the Articles Page when user click send button', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockUrl]}>
          <Routes>
            <Route path={AppRoute.EditArticle} element={<CreateNewPost edit />} />
            <Route path={AppRoute.Articles} element={<Posts />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    expect(await screen.findByText(/Edit article/i)).toBeInTheDocument();
    await act(async () => {
      await userEvent.clear(screen.getByPlaceholderText(/Title/i));
      await userEvent.type(screen.getByPlaceholderText(/Title/i), 'new title');

      await userEvent.clear(screen.getByPlaceholderText(/Short description/i));
      await userEvent.type(screen.getByPlaceholderText(/Short description/i), 'new short desc');

      await userEvent.clear(screen.getByPlaceholderText(/Text/i));
      await userEvent.type(screen.getByPlaceholderText(/Text/i), 'new post');

      await userEvent.type(screen.getByPlaceholderText(/Tag/i), 'new tag');
      await userEvent.click(screen.getByText(/add tag/i));
    });
    await userEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(await screen.findByText('new title')).toBeInTheDocument();
    expect(await screen.findByText('new short desc')).toBeInTheDocument();
    expect(await screen.findByText('new tag')).toBeInTheDocument();
  });
});
