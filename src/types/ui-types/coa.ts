export type CoaFormValues = {
  id: number;
  name: string;
  fiscalPeriodRuleId: number | null;
  organizationId: string;
};
export type CoaType = {
  id: number;
  name: string;
  fiscalPeriodRuleId: number | null;
  organizationId: string;
  createdById: string;
  ruleTitle?: string | null;
};
