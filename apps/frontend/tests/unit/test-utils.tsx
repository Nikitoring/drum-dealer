import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function renderWithQueryClient(children: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return { client, wrapper: ({ children: nested }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{nested}</QueryClientProvider>
  ) };
}
