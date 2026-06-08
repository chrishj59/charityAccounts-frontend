import z from 'zod';

export const fiscalPeriodRuleSchema = z
  .object({
    id: z.int(),
    name: z.string(),
    monthNum: z.int().optional(),
    day: z.int().optional(),
    fiscPeriod: z.int().optional(),
    yearShift: z.boolean(),
    calendarBased: z.boolean(),
    organizationId: z.string().optional(),
  })
  .superRefine((values, context) => {
    if (!values.calendarBased && !values.monthNum) {
      context.addIssue({
        code: 'custom', //z.ZodIssueCode.custom,
        message: 'Please add Month number',
        path: ['monthNum'],
      });
    }
    if (!values.calendarBased && !values.day) {
      context.addIssue({
        code: 'custom',
        message: 'Please add day of the month',
        path: ['monthNum'],
      });
    }
    if (!values.calendarBased && !values.fiscPeriod) {
      context.addIssue({
        code: 'custom',
        message: 'Please add Fiscal Period number',
        path: ['monthNum'],
      });
    }
  });

export type FiscPeriodRuleFormValues = z.infer<typeof fiscalPeriodRuleSchema>;
