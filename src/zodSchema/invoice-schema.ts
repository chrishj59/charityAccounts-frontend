import { z } from 'zod';

// define the schema with validation and error messages
export const invoiceSchema = z
  .object({
    customerName: z.string().min(1, 'Customer name is required'),
    billingAddress: z.string().min(1, 'Billing address is required'),
    invoiceDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
    dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
    lineItems: z
      .array(
        z.object({
          description: z.string().min(1, 'Description is required'),
          quantity: z.number().min(1, 'Quantity must be at least 1'),
          price: z.number().min(0.01, 'Price must be greater than 0'),
        }),
      )
      .min(1, 'At least one line item is required')
      // Custom validation logic with superRefine
      .superRefine((items, ctx) => {
        // Extract all descriptions from the array of items
        const descriptions = items.map((item) => item.description);

        // Loop through the descriptions to check for duplicates
        descriptions.forEach((desc, index) => {
          // If the description appears more than once in the array
          if (descriptions.indexOf(desc) !== index) {
            // Add a custom validation issue
            ctx.addIssue({
              code: 'custom', // Custom validation issue type
              message: 'Line item descriptions must be unique', // Error message
              path: [index, 'description'], // Path to the specific invalid field
            });
          }
        });
      }),
  })
  // Cross-field validation: Ensure invoiceDate is not after dueDate
  .refine(
    (data) => {
      const invoiceDate = new Date(data.invoiceDate);
      const dueDate = new Date(data.dueDate);
      return invoiceDate <= dueDate; // Invoice date must be before or equal to due date
    },
    {
      message: 'Invoice date must be on or before the due date',
      path: ['dueDate'], // Attach error to the `dueDate` field
    },
  )
  // Cross-field validation: Ensure dueDate is not in the past
  .refine(
    (data) => {
      const dueDate = new Date(data.dueDate);
      return dueDate >= new Date(); // Due date must not be in the past
    },
    {
      message: 'Due date cannot be in the past',
      path: ['dueDate'], // Attach error to the `dueDate` field
    },
  );

// export the type with Typescript inference
export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
