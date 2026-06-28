import { compareDesc } from 'date-fns/fp';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import CompanyGroupManageUI from '~/src/components/client/company/groupCompanyManage';
import { auth } from '~/src/lib/auth';
import { getUserDb } from '~/src/lib/db';
import { CompanyGroupUI } from '~/src/types/ui-types/compGrp';

export default async function CompanyGroupManagePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/unauthorised');
  }

  const userId = session.user.id;
  const orgId = session.session.activeOrganizationId ?? '';

  const userDb = await getUserDb(userId, orgId);

  const groupCompListDB = await userDb.companyGroup.findMany();
  const fiscPeriodsList = await userDb.fiscalPeriodRuleHeader.findMany();

  const groupCompList = groupCompListDB.map((comp) => {
    const _fiscPer = fiscPeriodsList.find(
      (period) => period.id === comp.fiscalPeriodRuleId,
    );

    const _comp: CompanyGroupUI = {
      id: comp.id,
      name: comp.name,
      fiscalRuleId: comp.fiscalPeriodRuleId,
      ruleTitle: _fiscPer?.title ?? '',
    };
    return _comp;
  });

  return (
    <CompanyGroupManageUI
      userId={userId}
      orgId={orgId}
      fiscRuleList={fiscPeriodsList}
      groupCompanyList={groupCompList}
    />
  );
}
