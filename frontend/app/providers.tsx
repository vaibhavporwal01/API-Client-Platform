'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e2128',
            color: '#f1f3f5',
            border: '1px solid #2d3139',
            borderRadius: '8px',
            fontFamily: 'var(--font-inter)',
            fontSize: '13px',
          },
        }}
      />
    </QueryClientProvider>
  );
}
