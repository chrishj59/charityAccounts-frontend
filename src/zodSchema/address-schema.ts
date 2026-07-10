import z from 'zod';
const ukPostcodeRegex = /^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][ABD-HJLNP-UW-Z]{2}$/;

export const addressSchema = z.object({
  buildingCode: z.string().nullable(),
  room: z.string().optional().nullable(),
  floor: z.number().optional().nullable(),
  careOf: z.string().max(50, 'The maximum length is 50  ').nullable(),
  street2: z.string().max(50, 'The maximum length is 50  ').nullable(),
  street3: z.string().max(50, 'Street3 can be up 10 characters').nullable(),
  houseNumber: z.number().nullable(),
  houseName: z.string().max(50, 'Name can be up 50 characters').optional(),
  street: z.string().max(50, 'Street can be up 50 characters').nullable(),
  town: z.string().max(50, 'Town can be up 50 characters').nullable(),
  county: z.string().max(50, 'Town can be up 50 characters').nullable(),
  postCode: z
    .string()
    .max(10, 'Post Code is required')
    .toUpperCase()
    .trim()
    .refine((val) => ukPostcodeRegex.test(val), {
      message: 'Invalid UK postcode format',
    }),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
