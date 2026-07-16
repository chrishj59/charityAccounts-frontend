import { organisationIdTypeEnum } from '~/src/app/constants/constants';

import {
  OrgIdentificationType,
  OrgPlanType,
  OrgLegalForm,
} from '~/zenstack/models';

export type OrganisationUI = {
  name: string | undefined;
  slug: string | undefined;
  logo: string | null | undefined;
  createdAt: Date | undefined;
  metadata: null | string | undefined;
  tradingName: string | undefined;
  legalForm: OrgLegalForm;
  legalName: string | undefined;
  charityNumber: string | null | undefined;
  taxRef: null | string | undefined;
  companyNumber: null | string | undefined;
  companyName: null | string | undefined;
  idType: OrgIdentificationType | undefined;
  identification: string | undefined;
  accountType: OrgPlanType | undefined;
  id: string;
};
