import { z } from 'zod';
import { addressSchema } from './address-schema';

// define the schema with validation and error messages
export const partnerBasicSchema = z.object({
  name: z.string().min(1, 'Customer name is required').max(50),
  personType: z.enum(['Person', 'Organisation']),
  familyName: z
    .string()
    .max(50, 'Longest family name is 50 characters')
    .optional(),

  searchTerm: z
    .string()
    .min(1, 'Search term is required')
    .max(20, 'Enter a search term upto 20 characters'),
  address: addressSchema,
});
