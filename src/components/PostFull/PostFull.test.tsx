import { Provider } from 'react-redux';
import { render, screen, waitFor } from '@testing-library/react';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import { rest } from 'msw';

import { AppRoute, BASE_URL } from '../../constants';
import { getMockArticles } from '../../mock/getMockArticles';
import { store } from '../../state/store';
import { server } from '../../setupTests';
import { api } from '../../services/api';

import PostFull from './PostFull';

const mockArticles = getMockArticles().articles;
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
});
