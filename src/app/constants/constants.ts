import type { SelectItem } from 'primereact/selectitem';

export enum saluationEnum {
  'Mr',
  'Mrs',
  'Miss',
  'Dr',
  'Professor',
}

export enum organisationCategoryEnum {
  'Company',
  'Partnership',
  'Person',
}

export enum organisationTypeEnum {
  'Company',
  'Charity',
  'Tax',
  'TradingName',
}

export enum organisationIdTypeEnum {
  'CompanyNum',
  'CharityNum',
  'TaxId',
  'TradingName',
}

export enum OrgLegalFormEnum {
  'SoleTrader',
  'Company',
  'Partnership',
}
export enum OrgIdentificationType {
  'UTR_tax_ref',
  'Company_Number',
  'Charity_number',
}
export enum OrgPlanType {
  'Trial',
  'Free',
  'Standard',
  'Premium',
}

export const ORG_LEGAL_FORM_OPTIONS: SelectItem[] = [
  { label: 'Sole Trader', value: 'SoleTrader' },
  { label: 'Company', value: 'Company' },
  { label: 'Partnership', value: 'Partnership' },
];

export const ID_TYPE_FORM_OPTIONS: SelectItem[] = [
  { label: 'UTR Tax number', value: 'UTR_tax_ref' },
  { label: 'Company Number', value: 'Company_Number' },
  { label: 'Charity number', value: 'Charity_number' },
];
