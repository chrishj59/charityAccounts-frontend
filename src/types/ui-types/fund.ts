import { UserUI } from './user';

type FundBalanceUI = {
  fiscalPeriod: number;
  fiscalYear: number;
  balance: number;
  curcyCode: string;
};

export type GeneralFundUI = {
  balance: number;
  curcyCode: string;
};

export type RestrictedFundUI = {
  projectEndDate?: Date;
  nextDonarReviewDate?: Date;
  returnSurplus?: boolean;
  designatedFund?: DesignatedFundUI;
  incomeFund?: IncomeFundUI;
  endownmentPermanent?: EndownmentPermanentUI;
  endownmentExpendable?: EndownmentExpendableUI;
};
export type DesignatedFundUI = {
  // designateMeeting: string;
  designatedBal: number;
  curcyCode: string;
  currentBal: number;

  designatedDate: Date;
  releasedDate: Date | null;
  designatedMeeting: string;
  undesignateMeeting?: string;
  designatedById?: string;
  designationReleasedById?: string;
  designationCreatedById?: string;
  designationCreatedBy?: UserUI;
  balances?: FundBalanceUI[];
};

export type IncomeFundUI = {
  balance: number;
  curcyCodeBalance: string;
};

export type EndownmentPermanentUI = {
  initalCapital: number;
  incomeEarned: number;
  incomeBalance: number;
  capitalBalance: number;
  curcyCode: string;
  permanentIncomeBalances?: FundBalanceUI[];
  permanentCapitalBalances?: FundBalanceUI[];
};

export type EndownmentExpendableUI = {
  initalCapital: number;
  incomeEarned: number;
  incomeBalance: number;
  capitalBalance: number;
  curcyCode: string;
  expendableIncomeBalances?: FundBalanceUI[];
  expendableCapitalBalances?: FundBalanceUI[];
};

export type FundUI = {
  id: string;
  fundName: string;
  donarName?: string;
  objective?: string;
  fundType: string;
  reviewDate?: Date;
  designatedFund?: DesignatedFundUI;
  restrictedFund?: RestrictedFundUI;
  generalFund?: GeneralFundUI;
  incomeFund?: IncomeFundUI;
  endownmentExpendable?: EndownmentExpendableUI;
  endownmentPermanent?: EndownmentPermanentUI;
};

export enum FundTypeEnum {
  'General',
  'Designated',
  'Income',
  'Expendable',
  'Permanent',
}
