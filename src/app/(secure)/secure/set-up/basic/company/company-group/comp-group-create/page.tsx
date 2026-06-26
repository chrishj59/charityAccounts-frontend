import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import NewCompanyGroupUI from '~/src/components/client/company/groupCompanyCreate';
import { auth } from '~/src/lib/auth';
import { getUserDb } from '~/src/lib/db';
import { FiscalPeriodRuleUI } from '~/src/types/ui-types/fiscal-period';

export default async function CompanyGroupCreatePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/unauthorised');
  }

  const userId = session.user.id;
  const orgId = session.session.activeOrganizationId ?? '';

  const userDb = await getUserDb(userId, orgId);
  const fiscPeriodRules = await userDb.fiscalPeriodRuleHeader.findMany({
    orderBy: { title: 'asc' },
  });

  if (fiscPeriodRules.length === 0) {
    // No rules so create default one

    const payload = {
      data: {
        title: 'Calendar based',

        calendarBased: true,
        organizationId: orgId,
        yearShift: false,
        createdById: userId,
      },
    };
    const _perRule = await userDb.fiscalPeriodRuleHeader.create(payload);
    fiscPeriodRules.push(_perRule);
  }
  const fisPerRuleList: FiscalPeriodRuleUI[] = [];
  fiscPeriodRules.forEach((per) => {
    const _perRule = {
      id: per.id,
      title: per.title,

      organizationId: per.organizationId,

      calendarBased: per.calendarBased,
    };
    fisPerRuleList.push(_perRule);
  });

  return (
    <NewCompanyGroupUI
      userId={userId}
      orgId={orgId}
      fiscRuleList={fisPerRuleList}
    />
  );
}
