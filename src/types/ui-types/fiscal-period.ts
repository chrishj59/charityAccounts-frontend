export type FiscalPeriodRuleUI = {
  id: number;
  title: string;
  periodName: string | null;
  periodNum: number | null;
  day: number | null | undefined;
  fiscPeriod: number | null;
  organizationId: string;

  yearShift: boolean | null;
  calendarBased: boolean;
};
