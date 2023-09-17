import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { AppRoute } from '../../constants';
import { mockArticlesResponse } from '../../mock/mockArticles';
import { createMockStore } from '../../mock/createMockStore';
import { addUserAction } from '../../state/userReducer';
import { mockUser } from '../../mock/mockUser';

import App from './App';

const mockArticles = mockArticlesResponse.articles;
const mockArticle = mockArticles[5];
const mockArticleUrl = `${AppRoute.Articles}/${mockArticle.slug}`;
const mockEditArticleUrl = `${AppRoute.Articles}/${mockArticle.slug}`;

describe('Component: App', () => {
  test('Should render Root Page correctly', async () => {
    const store = createMockStore();
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

  test('Should render Login Page correctly', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Login]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Realworld Blog')).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByText(/Password/i)).toBeInTheDocument();
  });

  test('Should render Registartion Page correctly', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Registration]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Realworld Blog')).toBeInTheDocument();
    expect(screen.getByText(/Create new account/i)).toBeInTheDocument();
    expect(screen.getByText(/Username/i)).toBeInTheDocument();
    expect(screen.getByText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText(/Repeat Password/i)).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  test('Should render Articles Page correctly', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Articles]}>
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

  test('Should render Article Page correctly', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockArticleUrl]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Realworld Blog')).toBeInTheDocument();
    expect(await screen.findByText(mockArticle.title)).toBeInTheDocument();
    expect(await screen.findByText(mockArticle.description)).toBeInTheDocument();
    expect(await screen.findByText(mockArticle.author.username)).toBeInTheDocument();
    expect(await screen.findByText(mockArticle.tagList[1])).toBeInTheDocument();
  });

  test('Should render Edit Article Page correctly', async () => {
    const store = createMockStore();
    store.dispatch(addUserAction(mockUser));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[mockEditArticleUrl]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Realworld Blog')).toBeInTheDocument();
    expect(await screen.findByText(mockArticle.title)).toBeInTheDocument();
    expect(await screen.findByText(mockArticle.description)).toBeInTheDocument();
    expect((await screen.findAllByText(mockArticle.author.username)).length).toBeTruthy();
    expect(await screen.findByText(mockArticle.tagList[1])).toBeInTheDocument();
  });

  test('Should render Create New Article Page correctly', async () => {
    const store = createMockStore();
    store.dispatch(addUserAction(mockUser));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.NewArticle]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Realworld Blog')).toBeInTheDocument();
    expect(screen.getByText(/Create new article/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Short description/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Text/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Tag/i)).toBeInTheDocument();
  });

  test('Should render Not Found Page correctly', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Root + 'not-correct-address']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/404/i)).toBeInTheDocument();
    expect(screen.queryByText(/Page not found/i)).toBeInTheDocument();
  });

  test('Should render Profile Page correctly', async () => {
    const store = createMockStore();
    store.dispatch(addUserAction(mockUser));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Profile]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Edit Profile/i)).toBeInTheDocument();
    expect(screen.queryByText(/Username/i)).toBeInTheDocument();
    expect(screen.queryByText(/Email address/i)).toBeInTheDocument();
    expect(screen.queryByText(/New password/i)).toBeInTheDocument();
    expect(screen.queryByText(/Avatar image/i)).toBeInTheDocument();
    expect(screen.queryByText(/Save/i)).toBeInTheDocument();
  });
});
