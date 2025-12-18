import { z } from 'zod';

import { addressSchema } from './address-schema';
import { passwordSchema } from './password';
const passwordMismatchErrorMessage =
  'Password and confirmed passwords are different. They must be the same';

export const userInputSchema = z
  .object({
    displayName: z.string().min(1, 'Display Name is required').nullable(),
    firstName: z.string().min(1, 'First Name is required').nullable(),
    familyName: z.string().min(1, 'familyName is required').nullable(),
    password: passwordSchema,
    confirmedPassword: z.string(),
    email: z.email('A valid email is required'),
    // role: z.string().optional().nullable(),
    // address: addressSchema.nullable(),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: passwordMismatchErrorMessage,
    path: ['confirmedPassword'],
  });

export type userInputValues = z.infer<typeof userInputSchema>;

export const userInputSchema2 = z.object({
  name: z.string(),
  firstName: z.string().min(1, 'First Name is required').nullable(),
});

export type userInputValues2 = z.infer<typeof userInputSchema2>;
