import { String } from 'aws-sdk/clients/codebuild';
import { headers } from 'next/headers';
import CompanyCreatePage from '~/src/components/client/company/create';
import { auth } from '~/src/lib/auth';
import { getLoggedInSession } from '~/src/utils/helper';

export default async function CreateCompany() {
  const session = getLoggedInSession();

  const orgs = await auth.api.listOrganizations({
    // This endpoint requires session cookies.
    headers: await headers(),
  });

  const numUserOrganisations = orgs.length;
  const topOrg = orgs[0];
  const orgId: String = orgs[0].id;

  //  get teams for organisation
  const data = await auth.api.listOrganizationTeams({
    query: {
      organizationId: orgId,
    },
    // This endpoint requires session cookies.
    headers: await headers(),
  });

  return <CompanyCreatePage orgId={orgId} />;
}
