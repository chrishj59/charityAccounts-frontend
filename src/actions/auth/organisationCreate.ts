'use server';
import { auth } from '~/src/lib/auth';
import { orgInputValues } from '~/src/zodSchema/signupOrg-schema';
import { Organization, UserWithRole } from 'better-auth/plugins';
import { OrgIdentificationType, OrgPlanType } from '~/zenstack/models';
import { orgCreateResponse, statusEnum } from '~/src/types/helper';

export async function orgCreateAction(
  org: orgInputValues,
  userId: string,
): Promise<orgCreateResponse> {
  const idType = Object.keys(OrgIdentificationType)[org.idType];
  const orgPlan = Object.keys(OrgPlanType)[org.accountType];
  const generatedSlug = org.tradingName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
  switch (idType) {
    case 'UTR_tax_ref':
      org.taxRef = org.identification;
      break;
    case 'Company_Number':
      org.companyNumber = org.identification;

      break;
    case 'Charity_number':
      org.charityNumber = org.identification;
  }

  if (org.legalForm === 'Company') {
    org.companyName = org.legalName;
  }

  try {
    const newOrg: Organization | null = await auth.api.createOrganization({
      body: {
        name: org.tradingName,
        tradingName: org.tradingName,
        slug: generatedSlug,
        legalForm: org.legalForm,
        legalName: org.legalName,
        idType: idType,
        identification: org.identification,
        accountType: orgPlan,
        taxRef: org.taxRef,
        companyNumber: org.companyNumber,
        companyName: org.companyName,
        userId: userId,
      },
    });
    console.log(`created organisation id ${JSON.stringify(newOrg?.id)}`);
    return {
      status: statusEnum.SUCCESS,
      message: 'Created the organisation',
    };
  } catch (error) {
    console.log(`Error creating org ${JSON.stringify(error)}`);
    return {
      status: statusEnum.ERROR,
      message: 'Could not create the organisation',
    };
  }
}
