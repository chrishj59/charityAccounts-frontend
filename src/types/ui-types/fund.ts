import Decimal from 'decimal.js';

export type GeneralFundUI = {
  balance: number;
};

export type FundUI = {
  id: string;
  fundName: string;
  donarName?: string;
  objective?: string;
  fundType: string;
  reviewDate: Date;
  generalFund?: GeneralFundUI;
};
