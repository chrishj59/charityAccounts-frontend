import { FiscalPeriodRule } from '~/zenstack/models';

import { getUserDb } from '~/src/lib/db';

import { auth } from '~/src/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import FiscPeriodRuleUI from '~/src/components/client/setup/fiscalPeriodRule';

export default async function FisPeriod() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/unauthorised');
  }
  const userId = session.user.id;
  const orgId = session.session.activeOrganizationId ?? '';
  const userDb = await getUserDb(userId, orgId);

  const rules: FiscalPeriodRule[] = await userDb.fiscalPeriodRule.findMany();
  console.log(`rules returned 2 ${JSON.stringify(rules)}`);
  // return <div>FisPrriod</div>;
  return <FiscPeriodRuleUI fiscRules={rules} orgId={orgId} userId={userId} />;
}
