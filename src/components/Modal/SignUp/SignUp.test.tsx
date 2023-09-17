import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { ToastContainer } from 'react-toastify';

import { AppRoute } from '../../../constants';
import { createMockStore } from '../../../mock/createMockStore';
import { addUserAction } from '../../../state/userReducer';
import { mockUser } from '../../../mock/mockUser';
import type { TNewUser } from '../../../types/users';

import SignUp from './SignUp';

describe('Component: SignUp', () => {
  test('Should render correctly', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Login]}>
          <Routes>
            <Route path={AppRoute.Login} element={<SignUp />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Create new account/i)).toBeInTheDocument();

    expect(screen.getByText(/Username/i)).toBeInTheDocument();
    expect(screen.getByText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Repeat Password')).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email address/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/Password/i).length).toBe(2);
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  test('Should redirect to the Root Page when user is authorized', async () => {
    const store = createMockStore();
    store.dispatch(addUserAction(mockUser));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Registration]}>
          <Routes>
            <Route path={AppRoute.Registration} element={<SignUp />} />
            <Route path={AppRoute.Root} element={<h1>This is the Root Page</h1>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Root Page/i)).toBeInTheDocument();
  });

  test('Should sign up, show success popap and redirect to the Root Page when user fill data and click create button', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Login]}>
          <Routes>
            <Route path={AppRoute.Login} element={<SignUp />} />
            <Route path={AppRoute.Root} element={<h1>This is Root Page</h1>} />
          </Routes>
          <ToastContainer />
        </MemoryRouter>
      </Provider>
    );
    const newUser: TNewUser = {
      username: 'cybercat2077',
      email: 'cybercat@gmail.com',
      password: 'qwertycat',
    };

    await act(async () => {
      await userEvent.type(screen.getByPlaceholderText(/username/i), newUser.username);
      await userEvent.type(screen.getByPlaceholderText(/email/i), newUser.email);
      await userEvent.type(screen.getByTestId('password'), newUser.password);
      await userEvent.type(screen.getByTestId('repeat-password'), newUser.password);
      await userEvent.click(screen.getByTestId('create'));
    });

    expect(await screen.findByText(/Your registration was successful!/i)).toBeInTheDocument();
    expect(await screen.findByText(/Root Page/i)).toBeInTheDocument();
    expect(store.getState().userInfo.user?.username).toBe(newUser.username);
    expect(store.getState().userInfo.user?.email).toBe(newUser.email);
  });

  test('Should show error popap when server responds with error', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Login]}>
          <Routes>
            <Route path={AppRoute.Login} element={<SignUp />} />
            <Route path={AppRoute.Root} element={<h1>This is Root Page</h1>} />
          </Routes>
          <ToastContainer />
        </MemoryRouter>
      </Provider>
    );

    const newUser: TNewUser = {
      username: mockUser.username,
      email: 'cybercat@gmail.com',
      password: 'qwertycat',
    };

    await act(async () => {
      await userEvent.type(screen.getByPlaceholderText(/username/i), newUser.username);
      await userEvent.type(screen.getByPlaceholderText(/email/i), newUser.email);
      await userEvent.type(screen.getByTestId('password'), newUser.password);
      await userEvent.type(screen.getByTestId('repeat-password'), newUser.password);
      await userEvent.click(screen.getByTestId('create'));
    });

    expect(await screen.findByText(/Username is already taken/i)).toBeInTheDocument();
    expect(store.getState().userInfo.user).toBe(null);
  });
});
