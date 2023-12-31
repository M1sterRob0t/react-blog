import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Routes, Route, MemoryRouter } from 'react-router-dom';

import { AppRoute, POSTS_PER_PAGE } from '../../../constants';
import { createMockStore } from '../../../mock/createMockStore';
import { mockArticlesResponse } from '../../../mock/mockArticles';

import PostsList from './PostsList';

const mockArticles = mockArticlesResponse.articles.slice(0, POSTS_PER_PAGE);

describe('Component: PostsList', () => {
  test('Should render correctly', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Root]}>
          <Routes>
            <Route path={AppRoute.Root} element={<PostsList articles={mockArticles} />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByTestId('post').length).toBe(POSTS_PER_PAGE);
    expect(screen.getAllByText(mockArticles[0].title)[0]).toBeInTheDocument();
    expect(screen.getAllByText(mockArticles[4].title)[0]).toBeInTheDocument();
  });
});
