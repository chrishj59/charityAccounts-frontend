import z, { nullable } from 'zod';

export const coaSchema = z.object({
  id: z.int(),
  name: z.string().min(5, 'Name greater than 5 characters length required'),
  fiscalPeriodRuleId: z
    .number()
    .nullable()
    .refine((val) => val !== null && val > 0, {
      message: 'Fiscal Period Rule is required',
    }),
  organizationId: z.string(),
  createdById: z.number(),
});

export type CoaFormValues = z.infer<typeof coaSchema>;
