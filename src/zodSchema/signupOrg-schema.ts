import { z } from 'zod';
export const orgInputSchema = z.object({
  tradingName: z.string().min(1, 'Trading name is required'),

  legalForm: z.string(),

  legalName: z.string().min(1, 'Legal name is required'),

  idType: z.number(),

  identification: z
    .string()
    .min(1, 'Indentification must be provided')
    .max(30, 'Maximum length is 30 characters'),
  accountType: z.number(),
  taxRef: z.string().optional(),
  companyNumber: z.string().optional(),
  charityNumber: z.string().optional(),
});

export type orgInputValues = z.infer<typeof orgInputSchema>;
