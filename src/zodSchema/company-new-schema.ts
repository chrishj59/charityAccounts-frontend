import z from 'zod';

export const companyNewSchema = z.object({
  ref: z.string().min(1, 'Company ref is required').max(10),
  name: z.string().min(1, 'Name is required').max(50),
  coa: z.string().min(1, 'Chart of Accounts required').max(10),
  fiscYear: z.string().min(1, 'Fiscal year is required').max(10),
  postPeriod: z.string().min(1, 'Posting periods ').max(10),
  vatRegNumber: z.string().min(1, 'VAT registration number').max(10),
});
