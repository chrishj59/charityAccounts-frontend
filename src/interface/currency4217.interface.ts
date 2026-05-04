import { addressSchema } from '../zodSchema/address-schema';
import { Calendar } from 'primereact/calendar';
export interface currency4217RowIF {
  entity: string;
  currency: string;
  alphabeticCode: string;
  numericCode: number;
  minorUnit: string;
  withdrawalDate: string;
}

export interface currencyCSVRowIF {
  Entity: string;
  Currency: string;
  AlphabeticCode: string;
  NumericCode: number;
  MinorUnit: string;
  WithdrawalDate: string;
}
