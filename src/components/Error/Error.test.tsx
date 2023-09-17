import { render, screen } from '@testing-library/react';

import Error from './Error';

describe('Component Error', () => {
  test('Should render correctly', () => {
    render(<Error />);

    expect(screen.queryByText(/Oops!/i)).toBeInTheDocument();
    expect(screen.queryByText(/Sorry, an unexpected error has occured./i)).toBeInTheDocument();
    expect(screen.queryByText(/Not Found/i)).toBeInTheDocument();
    expect(screen.queryByAltText(/Black cat looking at you./i)).toBeInTheDocument();
  });
});
