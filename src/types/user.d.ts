import {
  saluationEnum,
  organisationCategoryType,
  organisationType,
  rganisationIdType,
} from '@/app/constants/constants';

export type ISOCountry = {
  code2: string;
  code3: string;
  number: number;
  name: string;
  description: string;
};
export type Address = {
  houseNumber: number;
  street?: string;
  town?: string;
  county?: string;
  postCode: string;
  country?: ISOCountry;
};
export interface RationesUser {
  displayName: string;
  saluation?: saluationEnum;
  firstName?: string;
  familyName?: string;
  organisationName?: string;
  organistionId?: string;
  address: Address;

  town?: string;
  county?: string;
  postCode?: string;
  created: boolean;
  loggedin: boolean;
}

export interface RationesOrganisation {
  organisationCaterory: organisationCategoryType;
  organisationIdType: organisationIdType;
  organisationId: string;
  address: Address;
  created: boolean;
}
