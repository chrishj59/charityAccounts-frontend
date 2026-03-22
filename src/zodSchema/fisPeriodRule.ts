import z from 'zod';

export const fiscalPeriodRuleSchema = z
  .object({
    id: z.int(),
    name: z.string(),
    monthNum: z.int(),
    day: z.int(),
    fiscPeriod: z.int(),
    yearShift: z.boolean(),
    calendarBased: z.boolean(),
  })
  .superRefine((values, context) => {
    if (!values.calendarBased && !values.monthNum) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please add Month number',
        path: ['monthNum'],
      });
    }
    if (!values.calendarBased && !values.day) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please add day of the month',
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
