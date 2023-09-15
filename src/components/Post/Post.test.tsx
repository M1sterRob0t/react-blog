import { Provider } from 'react-redux';
import { render, screen, waitFor } from '@testing-library/react';
import { Routes, Route, MemoryRouter } from 'react-router-dom';

import { AppRoute } from '../../constants';
import { mockArticlesResponse } from '../../mock/mockArticles';
import { store } from '../../state/store';
import { mockUser } from '../../mock/mockUser';
import { addUserAction } from '../../state/userReducer';

import Post from './Post';

const mockArticles = mockArticlesResponse.articles;
const mockArticle = mockArticles[5];
const mockUrl = `${AppRoute.Articles}/${mockArticle.slug}`;

describe('Component: Posts', () => {
  test('should render full Post correctly', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockUrl]}>
          <Routes>
            <Route path={AppRoute.Article} element={<Post article={mockArticle} full />} />
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

  test('should render short Post correctly', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockUrl]}>
          <Routes>
            <Route path={AppRoute.Article} element={<Post article={mockArticle} />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText(mockArticle.title)).toBeInTheDocument();
      expect(screen.queryByText(mockArticle.description)).toBeInTheDocument();
      expect(screen.queryByText(mockArticle.tagList[0])).toBeInTheDocument();
      expect(screen.queryByText(mockArticle.body)).not.toBeInTheDocument();
    });
  });

  test('should render full Post from user correctly', async () => {
    store.dispatch(addUserAction(mockUser));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockUrl]}>
          <Routes>
            <Route path={AppRoute.Article} element={<Post article={mockArticle} fromUser />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Edit')).toBeInTheDocument();
      expect(screen.queryByText('Delete')).toBeInTheDocument();
    });
  });
});
