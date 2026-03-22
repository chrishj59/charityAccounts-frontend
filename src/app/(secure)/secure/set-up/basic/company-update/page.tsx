import { getLoggedInSession } from '~/src/utils/helper';
import { headers } from 'next/headers';
import { auth } from '~/src/lib/auth';

export default async function CompanyUpdate() {
  // const session = await getLoggedInSession();
  // const user = (await session).user;
  // const userOrgs = await auth.api.listOrganizations({
  //   // This endpoint requires session cookies.
  //   headers: await headers(),
  // });

  return (
    <>
      <div>user Orgs </div>
    </>
  );
}
