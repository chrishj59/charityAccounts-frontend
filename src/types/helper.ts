import { Organization, UserWithRole } from 'better-auth/plugins';

import { Dispatch, SetStateAction } from 'react';

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
}

export interface userCreateResponse extends responseType {
  data?: { user: UserWithRole; org?: Organization; errMessage?: string };
}

export interface orgCreateResponse extends responseType {
  data?: { org: Organization; errMessage?: string };
}

export type DB_ERROR = {
  reason: string;
  model: string;
};
