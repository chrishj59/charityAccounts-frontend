import z from 'zod';

import { organisationCategoryEnum } from '../app/constants/constants';
// names 'UTR Tax Reference', 'Company Number', 'Charity Number'
const idType = ['1', '2', '3'] as const;
import { OrgIdentificationType, OrgLegalForm } from '~/zenstack/models';

// names Trial Free Standard Premium
const accountType = ['1', '2', '3', '4'] as const;

export const companyNewSchema = z.object({
  ref: z.string().min(1, 'Company ref is required').max(10),
  tradingName: z.string().min(1, 'Trading Name is required').max(50),
  legalName: z.string().min(1, 'Registered Company name required').max(50),
  companyNumber: z.string().max(8).optional(),
  charityNumber: z
    .string()
    .max(8, 'Charity number maxium length is 8')
    .optional(),
  UTR: z
    .string()
    .max(10, 'Maximum length of Unique Tax reference is 10')
    .optional(),
  legalForm: z.enum(OrgLegalForm),
  legalType: z.enum(organisationCategoryEnum, 'Legal type is required'),
  idtype: z.enum(OrgIdentificationType, 'Identification type is required'),
  identification: z
    .string()
    .min(1, 'Identification is required')
    .max(50, 'Identification length max length 50'),
  // accountType: z.enum(accountType),
  chartOfAccountsId: z.number(),
  fiscalPeriodRuleId: z.number(),
  fiscYear: z.string().min(1, 'Fiscal year is required').max(10),
  postPeriod: z.string().min(1, 'Posting periods ').max(10),
  vatRegNumber: z.string().min(1, 'VAT registration number').max(10).optional(),
});

export type companyNewFormValues = z.infer<typeof companyNewSchema>;
