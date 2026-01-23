import { FiscalYearVariant } from '~/zenstack/models';
import { schema } from '~/zenstack/schema-lite';
import { useClientQueries } from '@zenstackhq/tanstack-query/react';
import FiscalYearVariantPage from '~/src/components/client/company/fiscalYearVariant';
import { getLoggedInSession } from '~/src/utils/helper';
import { authDb } from '~/src/lib/db';

export default async function FisYearVariant() {
  const session = getLoggedInSession();
  const db = authDb;
  const variants: FiscalYearVariant[] =
    await authDb.fiscalYearVariant.findMany();

  return <FiscalYearVariantPage fiscVar={variants} />;
}
