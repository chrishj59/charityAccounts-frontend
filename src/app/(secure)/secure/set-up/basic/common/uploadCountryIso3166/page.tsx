import { headers } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';
import LoadCountriesUI from '~/src/components/client/setup/config/loadCountries';
import { auth } from '~/src/lib/auth';

export default async function CurrencyUpload() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/unauthorised', RedirectType.replace);
  }
  const userId = session.user.id;

  const orgId = session.session.activeOrganizationId ?? '';

  return <LoadCountriesUI userId={userId} orgId={orgId} />;
}
