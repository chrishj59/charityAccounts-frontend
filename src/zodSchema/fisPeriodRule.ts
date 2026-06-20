import z from 'zod';

export const fiscalPeriodRuleSchema = z
  .object({
    id: z.int(),

    periodName: z.string(),
    periodNum: z.int(),
    day: z.int(),
    fiscPeriod: z.int(),
    yearShift: z.boolean().optional(),
    organizationId: z.string(),
  })
  .superRefine((values, context) => {
    if (!values.periodName) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please enter Period Name',
        path: ['monthNum'],
      });
    }
    if (!values.periodNum) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please add Period number',
        path: ['monthNum'],
      });
    }
    if (!values.day) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please add period day of the month',
        path: ['monthNum'],
      });
    }
    if (!values.fiscPeriod) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please add Fiscal Period number',
        path: ['monthNum'],
      });
    }
  });

export type FiscPeriodRuleFormValues = z.infer<typeof fiscalPeriodRuleSchema>;

export const fiscalPeriodRuleHeaderSchema = z.object({
  title: z.string().min(5, 'Title is required'),
  calendarBased: z.boolean(),
  fiscalPeriodRules: z.array(fiscalPeriodRuleSchema).optional(),
});

export type FiscalPeriodRuleHeaderFormValues = z.infer<
  typeof fiscalPeriodRuleHeaderSchema
>;
