import { Provider } from 'react-redux';
import { render, screen, waitFor } from '@testing-library/react';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import { rest } from 'msw';

import { AppRoute, POSTS_PER_PAGE } from '../../constants';
import { getMockArticles } from '../../mock/getMockArticles';
import { store } from '../../state/store';
import { server } from '../../setupTests';
import { api } from '../../services/api';

import Posts from './Posts';

const mockArticles = getMockArticles().articles.slice(0, POSTS_PER_PAGE);

describe('Component: Posts', () => {
  test('should render spinner when data is loading', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Root]}>
          <Routes>
            <Route path={AppRoute.Root} element={<Posts />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId(/spinner/i)).toBeInTheDocument();
  });

  test('should render Posts when server response status is 200', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Root]}>
          <Routes>
            <Route path={AppRoute.Root} element={<Posts />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() =>
      mockArticles.forEach((mockArticle) => expect(screen.getAllByText(mockArticle.title)[0]).toBeInTheDocument())
    );
  });

  test('should render Error when server response status is not 200', async () => {
    store.dispatch(api.util.invalidateTags(['Articles'])); // убираем предыдущий запрос из кэша rtk query

    server.use(
      rest.get('https://blog.kata.academy/api/articles', (req, res, ctx) => {
        return res(
          ctx.status(500), // HTTP статус 500 - ошибка сервера
          ctx.json({ message: 'Internal Server Error' }) // Тело ответа с сообщением об ошибке
        );
      })
    );

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Root]}>
          <Routes>
            <Route path={AppRoute.Root} element={<Posts />} />
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
