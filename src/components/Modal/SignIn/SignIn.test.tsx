import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { ToastContainer } from 'react-toastify';

import { AppRoute } from '../../../constants';
import { createMockStore } from '../../../mock/createMockStore';
import { addUserAction } from '../../../state/userReducer';
import { mockUser, mockUserPassword } from '../../../mock/mockUser';

import SignIn from './SignIn';

describe('Component: SignIn', () => {
  test('Should render correctly', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Login]}>
          <Routes>
            <Route path={AppRoute.Login} element={<SignIn />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.getByText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByText(/Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test('Should redirect to the Root Page when user is authorized', async () => {
    const store = createMockStore();
    store.dispatch(addUserAction(mockUser));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Login]}>
          <Routes>
            <Route path={AppRoute.Login} element={<SignIn />} />
            <Route path={AppRoute.Root} element={<h1>This is the Root Page</h1>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Root Page/i)).toBeInTheDocument();
  });

  test('Should log in, show success popap and redirect to the Root Page when user fill data and click login button', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Login]}>
          <Routes>
            <Route path={AppRoute.Login} element={<SignIn />} />
            <Route path={AppRoute.Root} element={<h1>This is Root Page</h1>} />
          </Routes>
          <ToastContainer />
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      await userEvent.type(screen.getByPlaceholderText(/email/i), mockUser.email);
      await userEvent.type(screen.getByPlaceholderText(/password/i), mockUserPassword);
      await userEvent.click(screen.getByText(/login/i));
    });

    expect(await screen.findByText(/successfully logged in/i)).toBeInTheDocument();
    expect(await screen.findByText(/Root Page/i)).toBeInTheDocument();
    expect(store.getState().userInfo.user).not.toBe(null);
  });

  test('Should show error popap when user send incorrect data', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Login]}>
          <Routes>
            <Route path={AppRoute.Login} element={<SignIn />} />
            <Route path={AppRoute.Root} element={<h1>This is Root Page</h1>} />
          </Routes>
          <ToastContainer />
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      await userEvent.type(screen.getByPlaceholderText(/email/i), 'incorrect email');
      await userEvent.type(screen.getByPlaceholderText(/password/i), 'incorrect password');
      await userEvent.click(screen.getByText(/login/i));
    });

    expect(await screen.findByText(/Email or password is incorrect/i)).toBeInTheDocument();
    expect(await screen.findByText(/Sign In/i)).toBeInTheDocument();
    expect(store.getState().userInfo.user).toBe(null);
  });
});
