import z from 'zod';

export const fiscalPeriodRuleSchema = z
  .object({
    id: z.int(),
    title: z.string(),
    periodName: z.string().optional(),
    periodNum: z.int().optional(),
    day: z.int().optional(),
    fiscPeriod: z.int().optional(),
    yearShift: z.boolean().optional(),
    organizationId: z.string(),
    calendarBased: z.boolean(),
  })
  .superRefine((values, context) => {
    if (!values.calendarBased && !values.periodName) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please enter Period Name',
        path: ['monthNum'],
      });
    }
    if (!values.calendarBased && !values.periodNum) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please add Period number',
        path: ['monthNum'],
      });
    }
    if (!values.calendarBased && !values.day) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please add period day of the month',
        path: ['monthNum'],
      });
    }
    if (!values.calendarBased && !values.fiscPeriod) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please add Fiscal Period number',
        path: ['monthNum'],
      });
    }
  });

export type FiscPeriodRuleFormValues = z.infer<typeof fiscalPeriodRuleSchema>;
