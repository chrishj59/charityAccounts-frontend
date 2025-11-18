import { LayoutProvider } from '../layout/context/layoutcontext';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import { twMerge } from 'tailwind-merge';
import Tailwind from 'primereact/passthrough/tailwind';
import '~/styles/layout/layout.scss';
import '~/styles/globals.css';
import { StackProvider, StackTheme } from '@stackframe/stack';
import { stackServerApp } from '~/stack/server';
import Footer from './components/footer';
import { Suspense } from 'react';

import '../styles/globals.css';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const value = {
    ripple: true,
  };
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link
          id='theme-link'
          href={`/theme/theme-light/purple/theme.css`}
          rel='stylesheet'
        ></link>
      </head>
      <body>
        <Suspense>
          <StackProvider app={stackServerApp}>
            <StackTheme>
              <PrimeReactProvider>
                {/* <PrimeReactProvider
                value={{
                  unstyled: true,
                  pt: Tailwind,
                  ptOptions: {
                    mergeSections: true,
                    mergeProps: true,
                    // classNameMergeFunction: twMerge,
                  },
                }}
              > */}
                {/* {children} */}
                {/* <div className='flex  min-h-screen  justify-content-center align-items-center '> */}
                <LayoutProvider>{children}</LayoutProvider>
                {/* </div> */}
                <div className='fixed bottom-0  right-0 left-0 '>
                  <div className='flex align-self-center align-items-center justify-content-center '>
                    <Footer />
                  </div>
                </div>
              </PrimeReactProvider>
            </StackTheme>
          </StackProvider>
        </Suspense>
      </body>
    </html>
  );
}
