declare module '@scalar/nextjs-api-reference' {
  import type { NextResponse } from 'next/server';

  interface ApiReferenceConfig {
    url?: string;
    content?: string | Record<string, unknown>;
    theme?: string;
    darkMode?: boolean;
    layout?: 'modern' | 'classic';
    metaData?: Record<string, string>;
    authentication?: Record<string, unknown>;
    cdn?: string;
    [key: string]: unknown;
  }

  export function ApiReference(
    config: ApiReferenceConfig,
  ): () => Promise<NextResponse>;
}
