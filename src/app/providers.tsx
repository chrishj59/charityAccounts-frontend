'use client';

import { PrimeReactProvider } from 'primereact/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  QuerySettingsProvider,
  type FetchFn,
} from '@zenstackhq/tanstack-query/react';

import type { ReactNode } from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { TanstackProvider } from '../components/client/providers/tanstack-provider';
import Footer from './components/footer';
const queryClient = new QueryClient();

const myFetch: FetchFn = (url, options) => {
  options = options ?? {};
  options.headers = {
    ...options.headers,
    'x-rationes-charitatis': 'true',
  };
  return fetch(url, options);
};

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <PrimeReactProvider>
      {/* <div className='flex  min-h-screen '> */}
      <LayoutProvider>
        <QueryClientProvider client={queryClient}>
          <QuerySettingsProvider
            value={{ endpoint: '/api/model', fetch: myFetch }}
          >
            {children}
          </QuerySettingsProvider>
        </QueryClientProvider>
      </LayoutProvider>
      {/* </div> */}
      <div className='fixed bottom-0  right-0 left-0 '>
        <div className='flex align-self-center align-items-center justify-content-center '>
          <Footer />
        </div>
      </div>
    </PrimeReactProvider>
  );
}
