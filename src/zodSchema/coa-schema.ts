import z from 'zod';

export const coaSchema = z.object({
  id: z.int(),
  name: z.string().min(5),
  fiscalPeriodRuleId: z.int(),
});

export type CoaFormValues = z.infer<typeof coaSchema>;
