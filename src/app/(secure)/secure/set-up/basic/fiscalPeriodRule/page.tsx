import { FiscalPeriodRule } from '~/zenstack/models';

import { getLoggedInSession } from '~/src/utils/helper';
import { authDb } from '~/src/lib/db';
import FiscalPeriod from '~/src/components/client/setup/fiscalPeriodRule';

export default async function FisPeriod() {
  const session = await getLoggedInSession();

  const rules: FiscalPeriodRule[] = await authDb.fiscalPeriodRule.findMany();
  console.log(`rules returned 2 ${JSON.stringify(rules)}`);
  // return <div>FisPrriod</div>;
  return (
    <FiscalPeriod
      fiscRules={rules}
      orgId={session?.session.activeOrganizationId ?? ''}
    />
  );
}
