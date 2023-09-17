import { screen, render, fireEvent } from '@testing-library/react';
import { Routes, Route, MemoryRouter } from 'react-router-dom';

import { AppRoute } from '../../constants';

import NotFound from './NotFound';

const INCORRECT_PASS = '/INCORRECT_PASS';

describe('Component: NotFound', () => {
  test('Should render correctly', () => {
    render(
      <MemoryRouter initialEntries={[INCORRECT_PASS]}>
        <Routes>
          <Route path={AppRoute.NotFound} element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.queryByText(/404/i)).toBeInTheDocument();
    expect(screen.queryByText(/Page not found/i)).toBeInTheDocument();
  });

  test('Link shoud navigate to the Main Page', () => {
    render(
      <MemoryRouter initialEntries={[INCORRECT_PASS]}>
        <Routes>
          <Route path={AppRoute.Root} element={<h1>This is the Main Page</h1>} />
          <Route path={AppRoute.NotFound} element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Main Page/i));
    expect(screen.queryByText(/Page not found/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Main Page/i)).toBeInTheDocument();
  });
});
