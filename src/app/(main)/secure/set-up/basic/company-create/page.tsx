import { String } from 'aws-sdk/clients/codebuild';
import { headers } from 'next/headers';
import { redirect, unauthorized } from 'next/navigation';
import CompanyCreatePage from '~/src/components/client/company/create';
import { auth } from '~/src/lib/auth';

export default async function CreateCompany() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log(`session ${JSON.stringify(session)}`);
  if (!session) {
    redirect('/unauthorised');
  }

  const userId = session.user.id;

  // const orgs = await auth.api.listOrganizations({
  //   // This endpoint requires session cookies.
  //   headers: await headers(),
  // });

  // const orgId: String = orgs[0].id;

  return <CompanyCreatePage userId={userId} />;
}
