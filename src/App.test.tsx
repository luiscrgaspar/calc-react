import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders the calculator inside the app shell', () => {
    render(<App />);

    expect(screen.getByRole('main')).toHaveClass('app');
    expect(screen.getByText('Calculator')).toBeVisible();
  });
});
