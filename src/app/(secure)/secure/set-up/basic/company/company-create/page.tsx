import { Organization } from 'better-auth/client';
import { name } from 'next/dist/server/ci-info';
import { headers } from 'next/headers';
import { redirect, unauthorized } from 'next/navigation';
import { organisationIdTypeEnum } from '~/src/app/constants/constants';
import NewCompanyUI from '~/src/components/client/company/companyCreate';

import { auth } from '~/src/lib/auth';
import { getUserDb } from '~/src/lib/db';
import { CoaType } from '~/src/types/ui-types/coa';
import { ISO3166CountryUI } from '~/src/types/ui-types/country';
import { FiscalPeriodRuleUI } from '~/src/types/ui-types/fiscal-period';
import { OrganisationUI } from '~/src/types/ui-types/organisation';
import {
  ISO3166Country,
  OrgIdentificationType,
  OrgPlanType,
} from '~/zenstack/models';

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

  const isoCountries: ISO3166Country[] = await userDb.iSO3166Country.findMany({
    orderBy: { name: 'asc' },
  });

  const countries: ISO3166CountryUI[] = isoCountries.map((c) => {
    const _country: ISO3166CountryUI = {
      id: c.id,
      name: c.name,
      alpha2: c.alpha2,
      alpha3: c.alpha3,
      countryCode: c.countryCode,
      iso3166: c.iso3166,
      region: c.region,
      subRegion: c.subRegion,
      intermediateRegion: c.intermediateRegion,
      intermediateRegionCode: c.intermediateRegionCode,

      userId: c.userId,
    };
    return _country;
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
        countries={countries}
      />
    );
  }
}
