import type { Metadata } from 'next/types';

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: 'https://rationes-charitatis.co.uk',
      images: 'https://rationes-charitatis.co.uk/og.png',
      siteName: 'Rationes Charity Accounting',
      ...override.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@rationes',
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: 'https://rationes-charitatis.co.uk/og.png',
      ...override.twitter,
    },
  };
}

export const baseUrl =
  process.env.NODE_ENV === 'development'
    ? new URL('http://localhost:3000')
    : new URL(`https://${process.env.VERCEL_URL!}`);
