import { FiscalPeriodRule } from '~/zenstack/models';

import { getLoggedInSession } from '~/src/utils/helper';
import { authDb } from '~/src/lib/db';
import FiscPeriodRule from '~/src/components/client/company/fiscalPeriodRule';

export default async function FisPeriod() {
  const session = getLoggedInSession();

  const rules: FiscalPeriodRule[] = await authDb.fiscalPeriodRule.findMany();
  console.log(`rules returned 2 ${JSON.stringify(rules)}`);

  return <FiscPeriodRule fiscRules={rules} />;
}
