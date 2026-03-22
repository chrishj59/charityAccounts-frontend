import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '~/src/lib/auth';

import ArAccountCreatePage from '~/src/components/client/ar/account/create';
import { getLoggedInSession } from '~/src/utils/helper';

export default async function ArAccountCreate() {
  const session = getLoggedInSession();
  return <ArAccountCreatePage />;
}
