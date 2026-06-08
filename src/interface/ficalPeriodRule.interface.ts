export interface fiscalPeriodRuleIF {
  id: number;
  name: string;
  monthNum: number | null;
  day: number | undefined | null;
  fiscPeriod: number | null;
  organisationId: string;
  yearShift: boolean | null;
  calendarBased: boolean;
}
