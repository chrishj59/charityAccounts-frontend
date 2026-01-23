import {
  OrgIdentificationType,
  OrgLegalForm,
  OrgPlanType,
} from '~/zenstack/models';
import { orgInputValues } from '../zodSchema/signupOrg-schema';

type User = {
  name: string;
  displayName: string;
  firstName: string;
  familyName: string;
  email: string;
};

type Org = {
  name: string;

  tradingName: string;
  legalForm: OrgLegalForm;
  legalName: string;
  charityNumber: string | null;
  taxRef: string | null;
  companyNumber: string | null;
  companyName: string | null;
  idType: OrgIdentificationType;
  identification: string;
  accountType: OrgPlanType;
};

export type signupPost = {
  user: User;
  org: orgInputValues;
};
