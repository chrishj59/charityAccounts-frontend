import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import CoaCreateUI from '~/src/components/client/setup/config/coaCreate';
import { auth } from '~/src/lib/auth';
import { getUserDb } from '~/src/lib/db';

export default async function CoaCreatePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/unauthorised');
  }
  const userId = session.user.id;
  const orgId = session.session.activeOrganizationId ?? '';
  const userDB = await getUserDb(userId, orgId);

  const fiscalPeriods = await userDB.fiscalPeriodRuleHeader.findMany();

  return (
    <CoaCreateUI userId={userId} orgId={orgId} fiscalPeriods={fiscalPeriods} />
  );
}
