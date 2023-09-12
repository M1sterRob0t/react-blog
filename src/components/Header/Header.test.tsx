import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import { configureMockStore } from '@jedmao/redux-mock-store';

import { removeUserAction } from '../../state/userReducer';
import { AppRoute } from '../../constants';
import type { TUserInfo } from '../../types/users';

import Header from './Header';

const mockStore = configureMockStore<TState>();
type TState = { userInfo: { user: TUserInfo | null } };

const unauthState: TState = {
  userInfo: {
    user: null,
  },
};

const authState: TState = {
  userInfo: {
    user: {
      username: 'example',
      email: 'example@mail.ru',
      image: null,
      bio: '',
      token: '!*&#^!(*@&#^!*(&@#^!*(@&#^*(1asd)',
    },
  },
};

describe('Component: Header', () => {
  test('should render correctly when user is Authorized', () => {
    render(
      <Provider store={mockStore(authState)}>
        <MemoryRouter initialEntries={[AppRoute.Root]}>
          <Header />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryByText(/Sign in/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sign up/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Create article/i)).toBeInTheDocument();
    expect(screen.queryByText(/Log out/i)).toBeInTheDocument();
  });

  test('should render correctly when user is not Authorized', () => {
    render(
      <Provider store={mockStore(unauthState)}>
        <MemoryRouter initialEntries={[AppRoute.Root]}>
          <Header />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryByText(/Sign in/i)).toBeInTheDocument();
    expect(screen.queryByText(/Sign up/i)).toBeInTheDocument();

    expect(screen.queryByText(/Create new article/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Profile/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Log out/i)).not.toBeInTheDocument();
  });

  test('should redirect to the Main Page when logo is clicked', () => {
    render(
      <Provider store={mockStore(authState)}>
        <MemoryRouter initialEntries={[AppRoute.NewArticle]}>
          <Header />
          <Routes>
            <Route path={AppRoute.Root} element={<h1>This is the Main Page</h1>} />
            <Route path={AppRoute.NewArticle} element={<h1>This is the Article Page</h1>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Article Page/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Realworld Blog/i));
    expect(screen.queryByText(/Main Page/i)).toBeInTheDocument();
  });

  // user is not authorized
  test('should redirect to the Login Page when login button is clicked', () => {
    render(
      <Provider store={mockStore(unauthState)}>
        <MemoryRouter initialEntries={[AppRoute.Root]}>
          <Header />
          <Routes>
            <Route path={AppRoute.Root} element={<h1>This is the Main Page</h1>} />
            <Route path={AppRoute.Login} element={<h1>This is the Login Page</h1>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Main Page/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Sign In/i));
    expect(screen.queryByText(/Login Page/i)).toBeInTheDocument();
  });

  test('should redirect to the Sign Up Page when sign up button is clicked', () => {
    render(
      <Provider store={mockStore(unauthState)}>
        <MemoryRouter initialEntries={[AppRoute.Root]}>
          <Header />
          <Routes>
            <Route path={AppRoute.Root} element={<h1>This is the Main Page</h1>} />
            <Route path={AppRoute.Registration} element={<h1>This is the Sign Up Page</h1>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Main Page/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Sign Up/i));
    expect(screen.queryByText(/Sign Up Page/i)).toBeInTheDocument();
  });

  // user is authorized
  test('should redirect to the Create New Article Page when create article button is clicked', () => {
    render(
      <Provider store={mockStore(authState)}>
        <MemoryRouter initialEntries={[AppRoute.Root]}>
          <Header />
          <Routes>
            <Route path={AppRoute.Root} element={<h1>This is the Main Page</h1>} />
            <Route path={AppRoute.NewArticle} element={<h1>This is the New Article Page</h1>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Main Page/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Create article/i));
    expect(screen.queryByText(/New Article Page/i)).toBeInTheDocument();
  });

  test('should redirect to the Profile Page when profile button is clicked', () => {
    const store = mockStore(authState);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Root]}>
          <Header />
          <Routes>
            <Route path={AppRoute.Root} element={<h1>This is the Main Page</h1>} />
            <Route path={AppRoute.Profile} element={<h1>This is the Profile Page</h1>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Main Page/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(authState.userInfo.user!.username));
    expect(screen.queryByText(/Profile Page/i)).toBeInTheDocument();
  });

  test('should require logout action when logout button is clicked', () => {
    const store = mockStore(authState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Root]}>
          <Header />
        </MemoryRouter>
      </Provider>
    );
    expect(store.getActions()).toStrictEqual([]);
    fireEvent.click(screen.getByText(/Log out/i));
    expect(store.getActions()[0]).toStrictEqual(removeUserAction());
  });
});
