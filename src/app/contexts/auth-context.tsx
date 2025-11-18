'use client';

import { RationesOrganisation, RationesUser } from '@/types';
import {
  organisationCategoryType,
  organisationIdType,
} from '../constants/constants';
import { createContext, ReactNode, useContext, useState } from 'react';

export type userContextType = {
  user: RationesUser;
  createUser: (user: RationesUser) => void;
  updateUser: (user: RationesUser) => void;
  removeUser: (userId: string) => void;
};

export type organisationContextType = {
  org: RationesOrganisation;
  createOrg: (org: RationesOrganisation) => void;
  updateOrg: (org: RationesOrganisation) => void;
  removeOrg: (org: string) => void;
};
const defaultUser = {
  displayName: '',
  created: false,
  loggedin: false,
};

const defaultOrg = {
  organisationCaterory: organisationCategoryType.Company,
  organisationIdType: organisationIdType.CompanyNum,
  organisationId: '',
  created: false,
};

const userContextDefaultValues: userContextType = {
  user: defaultUser,
  createUser: (user: RationesUser) => {},
  updateUser: (user: RationesUser) => {},
  removeUser: (userId: string) => {},
};

const organisationContextDefaultValues: organisationContextType = {
  org: defaultOrg,
  createOrg: (org: RationesOrganisation) => {},
  updateOrg: (org: RationesOrganisation) => {},
  removeOrg: (orgId: string) => {},
};

export const RationesUserContext = createContext<userContextType>(
  userContextDefaultValues,
);

export const RationesOrgContext = createContext<organisationContextType>(
  organisationContextDefaultValues,
);

export function useRationesUser() {
  return useContext(RationesUserContext);
}

export function useRationesOrg() {
  return useContext(RationesOrgContext);
}

type Props = {
  children: ReactNode;
};

export function RationesUserProvider({ children }: Props) {
  const [user, setUser] = useState<RationesUser>(defaultUser);
  const [userCreated, setUserCreated] = useState<boolean>(false);

  const createUser = (user: RationesUser) => {};

  const updateUser = (user: RationesUser) => {};

  const removeUser = (userId: string) => {};
  const userValue = {
    user,
    createUser,
    updateUser,
    removeUser,
  };
  return (
    <RationesUserContext.Provider value={userValue}>
      {' '}
      {children}
    </RationesUserContext.Provider>
  );
}

export function RationesOrgProvider({ children }: Props) {
  const [org, setOrg] = useState<RationesOrganisation>(defaultOrg);
  const [orgCreated, setOrgCreated] = useState<boolean>(false);

  const createOrg = (org: RationesOrganisation) => {};

  const updateOrg = (org: RationesOrganisation) => {};

  const removeOrg = (OrganisationId: string) => {};
  const orgValue = {
    org,
    createOrg,
    updateOrg,
    removeOrg,
  };
  return (
    <RationesOrgContext.Provider value={orgValue}>
      {' '}
      {children}
    </RationesOrgContext.Provider>
  );
}
