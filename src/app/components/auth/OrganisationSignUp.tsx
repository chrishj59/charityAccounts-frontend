import { organisationCategoryType } from '~/app/constants/constants';
import { RationesOrganisation } from '~/types';
import { Address } from '~/types/user';
import { NextPage } from 'next';
import { Dispatch, SetStateAction, useState } from 'react';

interface ChildProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const OrganisationSignUpPage = ({ step, setStep }: ChildProps) => {
  const [defaultOrg, setDefaultOrg] = useState<RationesOrganisation>();

  const defaultUserAddress: Address = {
    houseNumber: defaultOrg?.address.houseNumber
      ? defaultOrg?.address.houseNumber
      : 0,
    postCode: defaultOrg?.address.postCode ? defaultOrg?.address.postCode : '',
  };

  // const defaultOrgValues: RationesOrganisation = {
  //   organisationCaterory: defaultOrg?.organisationCaterory? defaultOrg?.organisationCaterory:  organisationCategoryType.Company
  // }

  return <div>Organisation page</div>;
};

export default OrganisationSignUpPage;
