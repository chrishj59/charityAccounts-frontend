 'use client';
 export default function InvoicePage() {
  return <div> invoice PAGE</div>
 }

// import { useForm, useFieldArray } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import {
//   invoiceSchema,
//   InvoiceFormValues,
// } from '~/src/zodSchema/invoice-schema';

// export default function InvoicePage() {
//   // Initialize form with React Hook Form, using Zod schema for validation
//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm<InvoiceFormValues>({
//     resolver: zodResolver(invoiceSchema), // Integrate Zod for schema-based validation
//     defaultValues: {
//       customerName: '',
//       billingAddress: '',
//       invoiceDate: '',
//       dueDate: '',
//       lineItems: [{ description: '', quantity: 1, price: 0.01 }], // Default line item
//     },
//   });
//   // Manage dynamic array of line items using useFieldArray
//   const { fields, append, remove } = useFieldArray({
//     control, // Control object from React Hook Form
//     name: 'lineItems', // Specify which field array to manage
//   });

//   // Submit handler for form
//   const onSubmit = (data: InvoiceFormValues) => {
//     console.log('Invoice Data:', data); // Log validated form data to the console
//   };

//   return (
//     <>
//       <form
//         onSubmit={(e) => {
//           e.preventDefault(); // Prevent default form submission behavior
//           handleSubmit(onSubmit)(); // Trigger validation and submit the form
//         }}
//       >
//         <h1>Invoice Generator</h1>

//         {/* Customer Name Field */}
//         <div>
//           <label>Customer Name:</label>
//           <input {...register('customerName')} />
//           {/* Displays validation error for "customerName" */}
//           {errors.customerName && (
//             <p style={{ color: 'red' }}>{errors.customerName.message}</p>
//             // Error message is shown if "customerName" is invalid
//           )}
//         </div>

//         {/* Billing Address Field */}
//         <div>
//           <label>Billing Address:</label>
//           <textarea {...register('billingAddress')} />
//           {errors.billingAddress && (
//             <p style={{ color: 'red' }}>{errors.billingAddress.message}</p>
//             // Error message is shown if "billingAddress" is invalid
//           )}
//         </div>

//         {/* Invoice Date Field */}
//         <div>
//           <label>Invoice Date:</label>
//           <input type='date' {...register('invoiceDate')} />
//           {errors.invoiceDate && (
//             <p style={{ color: 'red' }}>{errors.invoiceDate.message}</p>
//             // Error message is shown if "invoiceDate" is invalid
//           )}
//         </div>

//         {/* Due Date Field */}
//         <div>
//           <label>Due Date:</label>
//           <input type='date' {...register('dueDate')} />
//           {errors.dueDate && (
//             <p style={{ color: 'red' }}>{errors.dueDate.message}</p>
//             // Error message is shown if "dueDate" is invalid
//           )}
//         </div>

//         <h2>Line Items</h2>
//         {/* Dynamic Line Items */}
//         {fields.map((item, index) => (
//           <div key={item.id}>
//             <input
//               placeholder='Description'
//               {...register(`lineItems.${index}.description`)} // Bind to dynamic description field
//             />
//             {/* Displays validation error for line item "description" */}
//             {errors.lineItems?.[index]?.description && (
//               <p style={{ color: 'red' }}>
//                 {errors.lineItems[index].description?.message}
//               </p>
//               // Error message is shown if "description" is invalid
//             )}
//             <input
//               type='number'
//               placeholder='Quantity'
//               {...register(`lineItems.${index}.quantity`, {
//                 valueAsNumber: true,
//               })} // Ensure value is treated as a number
//             />
//             {/* Displays validation error for line item "quantity" */}
//             {errors.lineItems?.[index]?.quantity && (
//               <p style={{ color: 'red' }}>
//                 {errors.lineItems[index].quantity?.message}
//               </p>
//               // Error message is shown if "quantity" is invalid
//             )}
//             <input
//               type='number'
//               step='0.01'
//               placeholder='Price'
//               {...register(`lineItems.${index}.price`, { valueAsNumber: true })} // Ensure value is treated as a number
//             />
//             {/* Displays validation error for line item "price" */}
//             {errors.lineItems?.[index]?.price && (
//               <p style={{ color: 'red' }}>
//                 {errors.lineItems[index].price?.message}
//               </p>
//               // Error message is shown if "price" is invalid
//             )}
//             <button type='button' onClick={() => remove(index)}>
//               Remove
//             </button>
//           </div>
//         ))}

//         {/* Button to add new line item */}
//         <button
//           type='button'
//           onClick={
//             () => append({ description: '', quantity: 1, price: 0.01 }) // Add new default line item
//           }
//         >
//           Add Line Item
//         </button>

//         {/* Submit Button */}
//         <button type='submit'>Generate Invoice</button>
//       </form>
//     </>
//   );
// }
