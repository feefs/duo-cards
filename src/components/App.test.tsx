import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import App from './App';

const queryClient = new QueryClient();

test('renders learn react link', async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </MemoryRouter>
    );
  });
  const linkElement = screen.getByText(/Duo-cards/i);
  expect(linkElement).toBeInTheDocument();
});
