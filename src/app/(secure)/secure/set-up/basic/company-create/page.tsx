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

  console.log(`session ${JSON.stringify(session)}`);
  if (!session) {
    redirect('/unauthorised');
  }
  // const orgId = session.session.id;

  // if (!orgId) {
  //   redirect('/unauthorised');
  // }

  const userId = session.user.id;
  // const orgId = session.session.id;

  const orgs = await auth.api.listOrganizations({
    //await auth.api.listSessions({
    // This endpoint requires session cookies.
    headers: await headers(),
  });
  console.log(`Orgs ${JSON.stringify(orgs, null, 2)}`);
  const sessions = await auth.api.listSessions({ headers: await headers() });
  console.log(`session ${JSON.stringify(sessions, null, 2)}`);
  const orgId: String = orgs[0].id;

  const userDb = await getUserDb(userId, orgId);
  console.log(`orgId ${JSON.stringify(orgId)}`);

  const fiscPeriodRules = await userDb.fiscalPeriodRule.findMany({
    orderBy: { name: 'asc' },
  });

  if (fiscPeriodRules.length === 0) {
    // No rules so create default one

    const payload = {
      data: {
        name: 'Calendar based',
        calendarBased: true,
        organizationId: orgId,
        yearShift: false,
      },
    };
    const _perRule = await userDb.fiscalPeriodRule.create(payload);
    fiscPeriodRules.push(_perRule);
  }
  console.log(`fiscPeriodRules ${JSON.stringify(fiscPeriodRules, null, 2)}`);

  const fisPerRuleList: FiscalPeriodRuleUI[] = [];
  fiscPeriodRules.forEach((per) => {
    const _perRule = {
      id: per.id,
      name: per.name,
      monthNum: per.monthNum,
      day: per.day,
      fiscPeriod: per.fiscPeriod,
      organizationId: per.organizationId,

      yearShift: per.yearShift,
      calendarBased: per.calendarBased,
    };
    fisPerRuleList.push(_perRule);
  });
  console.log(
    `CreateCompanyUI called with ${JSON.stringify(userId)} orgId: ${JSON.stringify(orgId)} fisPerRuleList: ${JSON.stringify(fisPerRuleList, null, 2)} `,
  );
  return <NewCompanyUI />;
}
