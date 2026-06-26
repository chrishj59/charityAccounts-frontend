import z from 'zod';

export const companyGroupSchema = z.object({
  name: z.string().min(4),
  fiscalRuleId: z.number(),
});

export type CompanyGroupFormValues = z.infer<typeof companyGroupSchema>;
