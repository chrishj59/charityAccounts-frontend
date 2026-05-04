type FundBalanceUI = {
  fiscalPeriod: number;
  fiscalYear: number;
  balance: number;
  curcyCodeBalance: number;
};

export type GeneralFundUI = {
  balance: number;
};

export type DesignatedFundUI = {
  projectEndDate: Date;
  designateMeeting: string;
  designatedBal: number;
  curcyCodeDesignatedBal: string;
  currentBal: number;
  curcyCodecurrentBal: string;
  designatedDate: string;
  releasedDate: string;
  designatedMeeting: string;
  undesignateMeeting: string;
  designatedById: string;
  designationReleasedById: string;
  designationCreatedById: string;
  balances: FundBalanceUI[];
};

export type IncomeFundUI = {
  balance: number;
  curcyCodeBalance: string;
};

export type EndownmentPermanentUI = {
  initalCapitalAmount: number;
  curcyCodeInitialCapitalAmount: string;
  incomeBalance: number;
  curcyCodeIncomeBal: string;
  capitalBalance: number;
  curcyCodeCapitalBal: string;
  permanentIncomeBalances: FundBalanceUI[];
  permanentCapitalBalances: FundBalanceUI[];
};

export type EndownmentExpendableUI = {
  initalCapital: number;
  curcyCodeInitialCapital: string;
  incomeAmount: number;
  curcyCodeIncomeAmount: string;
  incomeBalance: number;
  curcyCodeIncomeBalance: string;
  capitalBalance: number;
  curcyCodeCapitalBal: number;
  expendableIncomeBalances: FundBalanceUI[];
  expendableCapitalBalances: FundBalanceUI[];
};

export type FundUI = {
  id: string;
  fundName: string;
  donarName?: string;
  objective?: string;
  fundType: string;
  reviewDate: Date;
  generalFund?: GeneralFundUI;
  designatedFund?: DesignatedFundUI;
  incomefund?: IncomeFundUI;
  endownmentPermanent?: EndownmentPermanentUI;
  endownmentExpendable?: EndownmentExpendableUI;
};
