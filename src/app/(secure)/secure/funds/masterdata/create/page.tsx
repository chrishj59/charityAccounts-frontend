import { headers } from 'next/headers';
import { RedirectType } from 'next/navigation';
import { redirect } from 'next/navigation';
import CreateFund from '~/src/components/client/funds/createFund';
import { auth } from '~/src/lib/auth';

export default async function CreateFundPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in', RedirectType.replace);
  }

  const data = await auth.api.listOrganizations({
    // This endpoint requires session cookies.
    headers: await headers(),
  });

  console.log(`user organisations ${JSON.stringify(data)}`);
  const usr = session.user;
  const userOrgId = data[0].id;

  return <CreateFund userId={usr.id} orgId={userOrgId} />;
}
