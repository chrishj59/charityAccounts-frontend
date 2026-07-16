import z from 'zod';
const ukPostcodeRegex = /^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][ABD-HJLNP-UW-Z]{2}$/;

export const addressSchema = z
  .object({
    buildingCode: z.string().optional(),
    room: z.string().optional().optional(),
    floor: z.number().optional().optional(),
    careOf: z.string().max(50, 'The maximum length is 50  ').optional(),
    street2: z.string().max(50, 'The maximum length is 50  ').optional(),
    street3: z.string().max(50, 'Street3 can be up 10 characters').optional(),
    houseNumber: z.number().optional(),
    houseName: z.string().max(50, 'Name can be up 50 characters').optional(),
    street: z.string().max(50, 'Street can be up 50 characters'),
    town: z.string().max(50, 'Town can be up 50 characters').optional(),
    county: z.string().max(50, 'Town can be up 50 characters').optional(),
    postCode: z.string().max(10, 'Post Code is required').toUpperCase().trim(),
    // .refine((val) => ukPostcodeRegex.test(val), {
    //   message: 'Invalid UK postcode format',
    // }),
    isoCountryId: z.number(),
  })
  .superRefine((data, ctx) => {
    if (!data.houseName && !data.houseNumber) {
      ctx.addIssue({
        code: 'custom',
        message: 'Either House Name or Number is required',
        path: ['houseName'],
      });
      ctx.addIssue({
        code: 'custom',
        message: 'Either House Name or Number is required',
        path: ['houseCounty'],
      });
    }
    if (data.postCode && data.isoCountryId === 235) {
      const normalized = data.postCode.trim().toUpperCase();

      if (!ukPostcodeRegex.test(normalized)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Enter a valid UK postcode',
          path: ['postCode'],
        });
      }
    }
  });

export type AddressFormValues = z.infer<typeof addressSchema>;
