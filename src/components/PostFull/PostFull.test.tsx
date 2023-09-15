import { Provider } from 'react-redux';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import { rest } from 'msw';

import { AppRoute, BASE_URL } from '../../constants';
import { mockArticlesResponse } from '../../mock/mockArticles';
import { store } from '../../state/store';
import { server } from '../../mock/mockServiceWorker';
import { api } from '../../services/api';
import { mockUser } from '../../mock/mockUser';
import { addUserAction } from '../../state/userReducer';

import PostFull from './PostFull';

const mockArticles = mockArticlesResponse.articles;
const mockArticle = mockArticles[5];
const mockUrl = `${AppRoute.Articles}/${mockArticle.slug}`;

describe('Component: Posts', () => {
  test('should render Spinner when data is loading', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockUrl]}>
          <Routes>
            <Route path={AppRoute.Article} element={<PostFull />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId(/spinner/i)).toBeInTheDocument();
  });

  test('should render Full Post when server response status is 200', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockUrl]}>
          <Routes>
            <Route path={AppRoute.Article} element={<PostFull />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText(mockArticle.title)).toBeInTheDocument();
      expect(screen.queryByText(mockArticle.description)).toBeInTheDocument();
      expect(screen.queryByText(mockArticle.body)).toBeInTheDocument();
      expect(screen.queryByText(mockArticle.tagList[0])).toBeInTheDocument();
    });
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
            <Route path={AppRoute.Article} element={<PostFull />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText(/oops/i)).toBeInTheDocument();
      expect(screen.queryByText(/Not Found/i)).toBeInTheDocument();
    });
  });

  test('should render additional interface when article is written by user', async () => {
    store.dispatch(addUserAction(mockUser));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockUrl]}>
          <Routes>
            <Route path={AppRoute.Article} element={<PostFull />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Edit')).toBeInTheDocument();
      expect(screen.queryByText('Delete')).toBeInTheDocument();
    });
  });

  test('should not render additional interface when article is not written by user', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockUrl]}>
          <Routes>
            <Route path={AppRoute.Article} element={<PostFull />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
      expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });
  });

  test('should increase likes count when like button is clicked first time', async () => {
    store.dispatch(addUserAction(mockUser));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockUrl]}>
          <Routes>
            <Route path={AppRoute.Article} element={<PostFull />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(mockArticle.favorited).toBe(false);
    const favoritesCountBeforeClick = mockArticle.favoritesCount;
    const favoritesCountAfterClick = favoritesCountBeforeClick + 1;

    expect(await screen.findByText(favoritesCountBeforeClick)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId(/like-button/i));
    expect(await screen.findByText(favoritesCountAfterClick)).toBeInTheDocument();
  });

  test('should decrease likes count when like button is clicked second time', async () => {
    store.dispatch(addUserAction(mockUser));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockUrl]}>
          <Routes>
            <Route path={AppRoute.Article} element={<PostFull />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    expect(mockArticle.favorited).toBe(true);
    const favoritesCountBeforeClick = mockArticle.favoritesCount;
    const favoritesCountAfterClick = favoritesCountBeforeClick - 1;

    expect(await screen.findByText(favoritesCountBeforeClick)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId(/like-button/i));
    expect(await screen.findByText(favoritesCountAfterClick)).toBeInTheDocument();
  });

  test('should navigate to the Edit Article Page when edit button is clicked', async () => {
    store.dispatch(addUserAction(mockUser));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockUrl]}>
          <Routes>
            <Route path={AppRoute.Article} element={<PostFull />} />
            <Route path={AppRoute.EditArticle} element={<h1>This is Edit Article Page</h1>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(await screen.findByText('Edit'));
    expect(await screen.findByText(/Edit Article Page/i)).toBeInTheDocument();
  });

  test('should show confirm popup when user clicked delete button', async () => {
    store.dispatch(addUserAction(mockUser));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockUrl]}>
          <Routes>
            <Route path={AppRoute.Article} element={<PostFull />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(await screen.findByText('Delete'));
    expect(await screen.findByText(/delete this article/i)).toBeInTheDocument();
  });

  test('should delete article and navigate to the root page after delete confirmation', async () => {
    store.dispatch(addUserAction(mockUser));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockUrl]}>
          <Routes>
            <Route path={AppRoute.Article} element={<PostFull />} />
            <Route path={AppRoute.Articles} element={<h1>This is the Articles Page</h1>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(await screen.findByText('Delete'));
    fireEvent.click(await screen.findByText('Yes'));
    expect(await screen.findByText(/This is the Articles Page/i)).toBeInTheDocument();
  });
});
