import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { AppRoute } from '../../constants';
import { store } from '../../state/store';
import { mockArticlesResponse } from '../../mock/mockArticles';

import App from './App';

const mockArticles = mockArticlesResponse.articles;

describe('Component: App', () => {
  test('Should render correctly', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Root]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Realworld Blog')).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(await screen.findByText(mockArticles[0].title)).toBeInTheDocument();
    expect(await screen.findByText(mockArticles[1].description)).toBeInTheDocument();
    expect((await screen.findAllByText(mockArticles[2].author.username)).length).toBeGreaterThan(3);
    expect(await screen.findByText(mockArticles[3].tagList[1])).toBeInTheDocument();
  });
});
