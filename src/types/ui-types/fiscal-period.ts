import { int } from 'aws-sdk/clients/datapipeline';

export type FiscalPeriodRuleUI = {
  id: number;
  name: string;
  monthNum: number | null;
  day: number | null | undefined;
  fiscPeriod: number | null;
  organizationId: string;

  yearShift: boolean | null;
  calendarBased: boolean;
};
