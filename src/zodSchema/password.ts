import { z } from 'zod';

const minLengthErrorMessage = 'Password must be over 8 characters';
const maxLengthErrorMessage = 'Password must be under 20  characters';
const uppercaseErrorMessage =
  'Your password must include at least 1 upper case letter ';
const lowercaseErrorMessage =
  'Your password must include at least 1 upper lower case letter ';
const numberErrorMessage = 'Your password must include at least 1 number';
const specialCharacterErrorMessage =
  'Your password must include at least 1 special character. Special characters: !@#$%^&*';
export const passwordSchema = z
  .string()
  .min(8, { message: minLengthErrorMessage })
  .max(20, { message: maxLengthErrorMessage })
  .refine((password) => /[A-Z]/.test(password), {
    message: uppercaseErrorMessage,
  })
  .refine((password) => /[a-z]/.test(password), {
    message: lowercaseErrorMessage,
  })
  .refine((password) => /[0-9]/.test(password), { message: numberErrorMessage })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    message: specialCharacterErrorMessage,
  });
