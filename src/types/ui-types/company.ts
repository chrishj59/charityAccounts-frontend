import {
  organisationCategoryEnum,
  organisationIdTypeEnum,
} from '~/src/app/constants/constants';
import { OrgIdentificationType, OrgLegalForm } from '~/zenstack/models';

export type CompanyUI = {
  // id: number;
  ref: string;
  tradingName: string;
  legalForm: OrgLegalForm;
  legalName: string;
  vatRegNumber?: string;
  // companyNumber?: string;
  // charityNumber?: string;
  // UTR?: string;
  // legalType: organisationCategoryEnum;
  idtype: OrgIdentificationType;
  identification: string;
  chartOfAccountsId: number;
  registeredCountryId: number;
  // registeredOfficeAddressId: number;
  // fiscalPeriodRuleId: number;
  // vatNumber?: string;
  // organizationId: string;
  //  chartOfAccountsId: number;

  // companyGroupId: number;
  // fiscYear: string;
  // addressLine?: string;
};
