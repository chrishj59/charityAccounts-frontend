'use server';
import { headers } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';
import { auth } from '../lib/auth';
import { rethrowIfRedirectError } from '../lib/redirectError';

export async function getLoggedInSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  try {
    if (!session) {
      redirect('/sign-in', RedirectType.replace);
    }
  } catch (error) {
    rethrowIfRedirectError(error);
    console.log(`error ${JSON.stringify(error)}`);
  }
  return session;
}
