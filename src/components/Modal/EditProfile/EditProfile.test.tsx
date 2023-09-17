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

import EditProfile from './EditProfile';

describe('Component: EditProfile', () => {
  test('Should render correctly', async () => {
    const store = createMockStore();
    store.dispatch(addUserAction(mockUser));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Profile]}>
          <Routes>
            <Route path={AppRoute.Profile} element={<EditProfile />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Edit Profile/i)).toBeInTheDocument();
    expect(screen.queryByText(/Username/i)).toBeInTheDocument();
    expect(screen.queryByText(/Email address/i)).toBeInTheDocument();
    expect(screen.queryByText(/New password/i)).toBeInTheDocument();
    expect(screen.queryByText(/Avatar image/i)).toBeInTheDocument();
    expect(screen.queryByText(/Save/i)).toBeInTheDocument();

    expect(screen.queryByDisplayValue(mockUser.username)).toBeInTheDocument();
    expect(screen.queryByDisplayValue(mockUser.email)).toBeInTheDocument();
    expect(screen.queryByDisplayValue(mockUser.image!)).toBeInTheDocument();
  });

  test('Should redirect to the Login Page when user is not authorized', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Profile]}>
          <Routes>
            <Route path={AppRoute.Profile} element={<EditProfile />} />
            <Route path={AppRoute.Login} element={<h1>This is Login Page</h1>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Login Page/i)).toBeInTheDocument();
  });

  test('Should upadte user info, show success popap and redirect to the Root Page when user change data and click save button', async () => {
    const store = createMockStore();
    store.dispatch(addUserAction(mockUser));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Profile]}>
          <Routes>
            <Route path={AppRoute.Profile} element={<EditProfile />} />
            <Route path={AppRoute.Articles} element={<h1>This is Root Page</h1>} />
          </Routes>
          <ToastContainer />
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      await userEvent.clear(screen.getByPlaceholderText(/username/i));
      await userEvent.type(screen.getByPlaceholderText(/username/i), 'new user name');
      await userEvent.click(screen.getByText(/save/i));
    });

    expect(await screen.findByText(/successfully updated/i)).toBeInTheDocument();
    expect(await screen.findByText(/Root Page/i)).toBeInTheDocument();
    expect(store.getState().userInfo.user?.username).toBe('new user name');
  });
});
