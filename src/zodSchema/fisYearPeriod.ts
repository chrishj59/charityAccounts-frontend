import z from 'zod';

export const fiscalYearPeriodSchema = z.object({
  id: z.int(),
  name: z.string().min(1, 'Month name is required').max(20),
  monthNum: z.int().min(1, 'month number is required'),
  day: z.int().min(1, 'Day of month required'),
  fiscPeriod: z.int().min(1, 'Fiscal period is required'),
  yearShift: z.boolean(),
});

export type FiscYearVariantFormValues = z.infer<typeof fiscalYearPeriodSchema>;
