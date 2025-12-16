import { Metadata } from 'next';
import { Toolbar } from 'primereact/toolbar';
import React from 'react';

import '~/src/styles/globals.css';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  console.log(`/src/app/(auth)layout called`);
  // return (
  //   <html lang='en'>
  //     <body>
  //       {/* Layout UI */}
  //       {/* Place children where you want to render a page or nested layout */}
  //       <main>{children}</main>
  //     </body>
  //   </html>
  // );
  const startContent = <div></div>;

  const endContent = <div></div>;

  const centerContent = (
    // <div className='flex flex-wrap align-items-center gap-3'>
    <span className=' font-bold text-primary-600 text-2xl'>
      Rationes Charitatis - authentication{' '}
    </span>
    // </div>
  );

  return (
    <>
      {/* <Toolbar
        center={centerContent}
        className='bg-green-200 shadow-2'
        style={{
          borderRadius: '3rem',
          backgroundImage:
            'linear-gradient(to right, var(--teal-50), var(--teal-200))',
        }}
      /> */}

      <main>
        <Toolbar
          center={centerContent}
          className='bg-green-200 shadow-2 mr-3 ml-3'
          style={{
            borderRadius: '3rem',
            backgroundImage:
              'linear-gradient(to right, var(--teal-50), var(--teal-200))',
          }}
        />
        {children}
      </main>
    </>
  );
}
