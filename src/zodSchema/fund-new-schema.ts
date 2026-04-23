import { mixValues } from 'framer-motion';
import { z } from 'zod';

export const fundNewSchema = z
  .object({
    name: z.string().min(1, 'Fund name is required'),
    donar: z.string().max(50, 'Donar name max length 50 char'),
    fundType: z.string(),
    objective: z.string().optional(),
    reviewDate: z.date(),
    projectEndDate: z.date().optional(),
    nextDonarReviewDate: z.date().optional(),
    returnSurplus: z.boolean().default(false).optional(),
    designatedDate: z.date().optional(),
    designatedById: z.int().optional(),
    designatedMeeting: z.string(),
  })
  .superRefine((values, context) => {
    if (
      values.fundType === 'Income' ||
      values.fundType === 'Expendable' ||
      values.fundType === 'Permanent'
    ) {
      if (!values.objective) {
        context.addIssue({
          code: 'custom',
          message: 'Objective is required',
          path: ['objective'],
        });
      }

      if (!values.reviewDate) {
        context.addIssue({
          code: 'custom',
          message: 'Date for review of objective progress requied',
          path: ['reviewDate'],
        });
      }

      // if (values.designatedMeeting === '') {
      //   context.addIssue({
      //     code: 'custom',
      //     message: 'Fund designation must be approved in Mangement meeting',
      //     path: ['designatedMeeting'],
      //   });
      // }
      // if (
      //   values.fundType === 'Income' ||
      //   values.fundType === 'Expendable' ||
      //   values.fundType === 'Permanent'
      // ) {
      if (values.donar === '') {
        context.addIssue({
          code: 'custom',
          message: 'Donar is required',
          path: ['donar'],
        });
      }
      return;
    }
    if (values.fundType === 'Designated') {
      console.warn(
        `in Designated fund values ${JSON.stringify(values, null, 2)}`,
      );
      if (!values.objective) {
        context.addIssue({
          code: 'custom',
          message: 'Objective is required',
          path: ['objective'],
        });
      }
    }
  });

export type FundNewFormValues = z.infer<typeof fundNewSchema>;
