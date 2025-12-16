import { auth } from '~/src/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';
import { NextRequest } from 'next/server';

export const { GET } = toNextJsHandler(auth);

export const POST = async (req: NextRequest) => {
  console.log(`/api/auth called with ${JSON.stringify(req)}`);
  const res = await auth.handler(req);
  return res;
};
