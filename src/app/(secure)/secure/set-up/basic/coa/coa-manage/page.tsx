import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import CoaManageUI from '~/src/components/client/setup/config/coaManage';
import { auth } from '~/src/lib/auth';
import { getUserDb } from '~/src/lib/db';
import { CoaType } from '~/src/types/ui-types/coa';

export default async function CoaUpdatePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/unauthorised');
  }
  const userId = session.user.id;
  const orgId = session.session.activeOrganizationId ?? '';

  const userDb = await getUserDb(userId, orgId);
  const coaResult = await userDb.chartOfAccounts.findMany({
    include: {
      fiscPeriodRule: true,
    },
  });
  const coaList: CoaType[] = [];
  coaResult.forEach((c) => {
    const _coa: CoaType = {
      id: c.id,
      name: c.name,
      fiscalPeriodRuleId: c.fiscalPeriodRuleId,
      organizationId: c.organizationId,
      createdById: c.createdById,
      ruleTitle: c.fiscPeriodRule.title,
    };
    coaList.push(_coa);
  });

  const fiscPeriods = await userDb.fiscalPeriodRuleHeader.findMany();
  return (
    <CoaManageUI
      userId={userId}
      orgId={orgId}
      coa={coaList}
      fiscPeriods={fiscPeriods}
    />
  );
}
