import { screen, render } from '@testing-library/react';

import Spinner from './Spinner';

describe('Component: Spinner', () => {
  test('Should render correctly', () => {
    render(<Spinner />);
    expect(screen.getByTestId(/spinner/i)).toBeInTheDocument();
  });
});
