import { String } from 'aws-sdk/clients/codebuild';
import { headers } from 'next/headers';
import { redirect, unauthorized } from 'next/navigation';
import NewCompanyUI from '~/src/components/client/company/newCompany';

import { auth } from '~/src/lib/auth';
import { getUserDb } from '~/src/lib/db';
import { FiscalPeriodRuleUI } from '~/src/types/ui-types/fiscal-period';

export default async function CreateCompany() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/unauthorised');
  }
  // const orgId = session.session.id;

  // if (!orgId) {
  //   redirect('/unauthorised');
  // }

  const userId = session.user.id;
  // const orgId = session.session.id;

  // const orgs = await auth.api.listOrganizations({
  //   //await auth.api.listSessions({
  //   // This endpoint requires session cookies.
  //   headers: await headers(),
  // });

  // const sessions = await auth.api.listSessions({ headers: await headers() });

  //const orgId: String = orgs[0].id;

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

  return <NewCompanyUI fiscRuleList={fisPerRuleList} orgId={orgId} />;
}
