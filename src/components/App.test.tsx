import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import App from './App';

const queryClient = new QueryClient();

test('renders learn react link', async () => {
  await act(async () => {
    const history = createMemoryHistory();
    render(
      <Router location={'/'} navigator={history}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Router>
    );
  });
  const linkElement = screen.getByText(/Duo-cards/i);
  expect(linkElement).toBeInTheDocument();
});
