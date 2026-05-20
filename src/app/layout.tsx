// import { LayoutProvider } from '../layout/context/layoutcontext';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import { twMerge } from 'tailwind-merge';
import Tailwind from 'primereact/passthrough/tailwind';
import '~/src/styles/layout/layout.scss';
import '~/src/styles/globals.css';

import Footer from './components/footer';
import { Suspense } from 'react';

import Providers from './providers';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
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
          <Providers>{children}</Providers>
          {/* <PrimeReactProvider>
            {/* <div className='flex  min-h-screen '> */}
          {/* <LayoutProvider>
              <TanstackProvider>{children}</TanstackProvider>
            </LayoutProvider> */}
          {/* </div> */}
          {/* <div className='fixed bottom-0  right-0 left-0 '>
              <div className='flex align-self-center align-items-center justify-content-center '>
                <Footer />
              </div>
            </div>
          </PrimeReactProvider> */}
        </Suspense>
      </body>
    </html>
  );
}
