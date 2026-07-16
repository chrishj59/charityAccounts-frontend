import z from 'zod';

import { organisationCategoryEnum } from '../app/constants/constants';
// names 'UTR Tax Reference', 'Company Number', 'Charity Number'
const idType = ['1', '2', '3'] as const;
import { OrgIdentificationType, OrgLegalForm } from '~/zenstack/models';

// names Trial Free Standard Premium
const accountType = ['1', '2', '3', '4'] as const;

export const companyNewSchema = z.object({
  ref: z.string().min(1, 'Company ref is required').max(10),
  tradingName: z.string(),
  legalName: z.string(),
  //   .string()
  //   .min(1, 'Registered Company name required')
  //   .max(50)
  //   .optional(),
  // companyNumber: z.string().max(8).optional(),
  // charityNumber: z
  //   .string()
  //   .max(8, 'Charity number maxium length is 8')
  //   .optional(),
  // UTR: z
  //   .string()
  //   .max(10, 'Maximum length of Unique Tax reference is 10')
  //   .optional(),
  legalForm: z.enum(OrgLegalForm),
  // legalType: z
  //   .enum(organisationCategoryEnum, 'Legal type is required')
  //   .optional(),
  idtype: z
    .enum(OrgIdentificationType, 'Identification type is required')
    .optional(),
  identification: z
    .string()
    .min(1, 'Identification is required')
    .max(50, 'Identification length max length 50')
    .optional(),

  chartOfAccountsId: z.number({ message: 'Chart of accounts is required' }),
  // // accountType: z.enum(accountType),
  fiscalPeriodRuleId: z
    .number({ message: 'Fiscal period rule is required' })
    .optional(),
  // fiscYear: z.string().min(1, 'Fiscal year is required').max(10).optional(),
  // postPeriod: z.string().min(1, 'Posting periods ').max(10).optional(),
  vatRegNumber: z.string().min(1, 'VAT registration number').max(10),
  registeredCountryId: z.number({ message: 'Company country is required' }),
});

export type companyNewFormValues = z.infer<typeof companyNewSchema>;
