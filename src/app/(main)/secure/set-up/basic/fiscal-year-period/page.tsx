import { FiscalYearPeriod } from '~/zenstack/models';

import { getLoggedInSession } from '~/src/utils/helper';
import { authDb } from '~/src/lib/db';
import FiscalPeriod from '~/src/components/client/company/fiscalPeriodRule';

export default async function FisPeriod() {
  const session = getLoggedInSession();
  const db = authDb;
  const variants: FiscalYearPeriod[] = await authDb.fiscalYearPeriod.findMany();

  return <FiscalPeriod fiscVar={variants} />;
}
