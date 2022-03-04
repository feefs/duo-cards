import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import App from './App';

test('renders learn react link', async () => {
  await act(async () => {
    const history = createMemoryHistory();
    render(
      <Router location={'/duo-cards'} navigator={history}>
        <App />
      </Router>
    );
  });
  const linkElement = screen.getByText(/Not signed in!/i);
  expect(linkElement).toBeInTheDocument();
});
