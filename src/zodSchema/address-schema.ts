import z from 'zod';

export const addressSchema = z.object({
  buildingCode: z.string().nullable(),
  room: z.string().optional().nullable(),
  floor: z.number().optional().nullable(),
  careOf: z.string().max(50, 'The maximum length is 50  ').nullable(),
  street2: z.string().max(50, 'The maximum length is 50  ').nullable(),
  street3: z.string().max(50, 'Street3 can be up 10 characters').nullable(),
  houseNumber: z.number().nullable(),
  street: z.string().max(50, 'Street can be up 50 characters').nullable(),
  town: z.string().max(50, 'Town can be up 50 characters').nullable(),
  county: z.string().max(50, 'Town can be up 50 characters').nullable(),
  postCode: z.string().max(10, 'Town can be up 10 characters').nullable(),
});
