import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders AI Link Suggestions heading', () => {
  render(<App />);
  const heading = screen.getByText(/AI Link Suggestions/i);
  expect(heading).toBeInTheDocument();
});
