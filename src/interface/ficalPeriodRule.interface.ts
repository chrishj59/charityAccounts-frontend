export interface fiscalPeriodRuleIF {
  id: number;
  title: string | null;
  periodName: string | null;
  periodNum: number | null;
  day: number | undefined | null;
  fiscPeriod: number | null;
  organisationId: string;
  yearShift: boolean | null;
  calendarBased: boolean;
}
