import { Organization, UserWithRole } from 'better-auth/plugins';
import { ToastMessage } from 'primereact/toast';

import { Dispatch, SetStateAction } from 'react';
import { FiscalPeriodRule } from '~/zenstack/models';
import { FundUI } from './ui-types/fund';

export type Dispatcher<S> = Dispatch<SetStateAction<S>>;

export enum statusEnum {
  SUCCESS,
  WARN,
  ERROR,
  FATAL,
}
export interface responseType {
  status: statusEnum;
  message: string;
  errMessage?: string;
}

export interface userCreateResponse extends responseType {
  data?: { user: UserWithRole; org?: Organization; errMessage?: string };
}

export interface orgCreateResponse extends responseType {
  data?: { org: Organization; errMessage?: string };
}

export interface fiscPeriodRuleResponse extends responseType {
  data?: { fiscalPeriodRule?: FiscalPeriodRule; error?: DB_ERROR };
}

export type DB_ERROR = {
  reason: string;
  model: string;
};

export type userContextType = {
  userId: string;
  organizationId: string;
  organizationRole?: string;
};

export function isFundUI(value: FundUI | responseType): value is FundUI {
  return (
    value != null &&
    typeof value === 'object' &&
    'id' in value &&
    'fundName' in value
  );
}
