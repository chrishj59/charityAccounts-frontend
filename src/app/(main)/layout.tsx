import { Metadata } from 'next';
import Layout from '~/layout/layout';

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

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Layout>{children}</Layout>)
    </>
  );
}

export const viewport = {
  initialScale: 1,
  width: 'device-width',
};
