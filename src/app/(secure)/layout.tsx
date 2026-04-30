import { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect, RedirectType, unauthorized } from 'next/navigation';
import { Toolbar } from 'primereact/toolbar';
import Layout from '~/src/layout/layout';
import { auth } from '~/src/lib/auth';
import { client, useSession } from '~/src/lib/auth-client';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'Rationes Charitatis - Accounting',

  description:
    'Charity and restricted fund accounting including VAT returns via MTD',

  robots: { index: true, follow: true },

  openGraph: {
    type: 'website',
    title: 'Rationes Charitatis Accounting',
    url: 'https://www.primefaces.org/apollo-react',
    description: 'Charity and restricted fund accounting in accordance in SORP',
    images: ['https://www.rationes-charitatis/images/economy.svg'],
    ttl: 604800,
  },

  icons: {
    icon: '/app/favicon.ico',
  },
};

export default async function SecureLayout({ children }: MainLayoutProps) {
  console.log('MainLayout (app/(secure)/layout');
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in', RedirectType.replace);
  }

  const centerContent = (
    // <div className='flex flex-wrap align-items-center gap-3'>
    <span className=' font-bold text-primary-600 text-2xl'>
      Rationes Charitatis - {session.user.name}
    </span>
    // </div>
  );
  return (
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
      <Layout>{children}</Layout>)
    </main>
  );
}

export const viewport = {
  initialScale: 1,
  width: 'device-width',
};
