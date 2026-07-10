import { Organization } from 'better-auth/client';
import { headers } from 'next/headers';
import { redirect, unauthorized } from 'next/navigation';
import { organisationIdTypeEnum } from '~/src/app/constants/constants';
import NewCompanyUI from '~/src/components/client/company/companyCreate';

import { auth } from '~/src/lib/auth';
import { getUserDb } from '~/src/lib/db';
import { CoaType } from '~/src/types/ui-types/coa';
import { FiscalPeriodRuleUI } from '~/src/types/ui-types/fiscal-period';
import { OrganisationUI } from '~/src/types/ui-types/organisation';
import { OrgIdentificationType, OrgPlanType } from '~/zenstack/models';

export default async function CreateCompany() {
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

  const coa = await userDb.chartOfAccounts.findMany({
    orderBy: { name: 'asc' },
  });

  const data = await auth.api.getFullOrganization({
    query: {
      organizationId: orgId,
    },
    // This endpoint requires session cookies.
    headers: await headers(),
  });

  let orgUI: OrganisationUI;
  if (data) {
    const createdDate = new Date(data.createdAt);

    const org = {
      name: data?.name,
      slug: data?.slug,
      logo: data?.logo,
      createdAt: new Date(data.createdAt),
      metadata: data?.metadata,
      tradingName: data.tradingName,
      legalForm: data.legalForm,
      legalName: data.legalName,
      charityNumber: data.charityNumber,
      taxRef: data.taxRef,
      companyNumber: data.companyNumber,
      companyName: data.companyName,
      idType: data.idType as OrgIdentificationType,
      identification: data.identification,
      accountType: data.accountType as OrgPlanType,
      id: data.id,
    };
    orgUI = org;
    console.log(`orgUI ${JSON.stringify(orgUI, null, 2)}`);

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

    const coaList: CoaType[] = [];
    coa.forEach((chart) => {
      const _coa: CoaType = {
        id: chart.id,
        name: chart.name,
        fiscalPeriodRuleId: chart.fiscalPeriodRuleId,
        organizationId: chart.organizationId,
        createdById: chart.createdById,
      };
      coaList.push(_coa);
    });

    return (
      <NewCompanyUI
        fiscRuleList={fisPerRuleList}
        coaList={coaList}
        orgUI={orgUI}
        userId={userId}
      />
    );
  }
}
