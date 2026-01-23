import { email, z } from 'zod';

import { addressSchema } from './address-schema';
import { passwordSchema } from './password';
import { client } from '../lib/auth-client';
import { easeIn } from 'framer-motion';
import { userEmailExist } from '../actions/auth/signup-organisation';
const passwordMismatchErrorMessage =
  'Password and confirmed passwords must be identical.';

const uniqueEmail = async (email: string): Promise<boolean> => {
  return await userEmailExist(email);
};

export const userInputSchema = z
  .object({
    displayName: z.string().min(1, 'Display Name is required'),
    firstName: z.string().min(1, 'First Name is required'),
    familyName: z.string().min(1, 'familyName is required'),
    password: passwordSchema,
    confirmedPassword: z.string(),
    email: z.email('A valid email is required'),
    role: z.string().optional().nullable(),
    address: addressSchema.optional().nullable(),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: passwordMismatchErrorMessage,
    path: ['confirmedPassword'],
  })
  .superRefine(async ({ email }, ctx) => {
    const emailEnique = await uniqueEmail(email);
    if (!emailEnique) {
      ctx.addIssue({
        code: 'custom',
        message: 'The email already exists',
        path: ['email'],
      });
    }
  });

export type userInputValues = z.infer<typeof userInputSchema>;

// export const userInputSchema2 = z.object({
//   name: z.string(),
//   firstName: z.string().min(1, 'First Name is required').nullable(),
// });

// export type userInputValues2 = z.infer<typeof userInputSchema2>;
