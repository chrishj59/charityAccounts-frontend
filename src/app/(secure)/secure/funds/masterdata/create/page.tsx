import { User } from 'better-auth';
import { headers } from 'next/headers';
import { RedirectType } from 'next/navigation';
import { redirect } from 'next/navigation';
import CreateFund from '~/src/components/client/funds/createFund';
import { auth } from '~/src/lib/auth';
import { getLoggedInSession } from '~/src/utils/helper';

export default async function CreateFundPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in', RedirectType.replace);
  }

  const usr: User = session.user;
  return <CreateFund userId={usr.id} />;
}
