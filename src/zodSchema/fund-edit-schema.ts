import { mixValues } from 'framer-motion';
import { z } from 'zod';
import { UserUI } from '../types/ui-types/user';

export const fundEditSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, 'Fund name is required'),
    donar: z.string().optional(), //max(50, 'Donar name max length 50 char'),
    fundType: z.string().optional(),
    objective: z.string().optional(),
    reviewDate: z.date().optional(),
    projectEndDate: z.date().optional(),
    nextDonarReviewDate: z.date().optional(),
    returnSurplus: z.boolean().default(false).optional(),
    designatedDate: z.date().optional(),
    designatedById: z.string().optional(),
    designatedMeeting: z.string().optional(),
    undesignateMeeting: z.string().optional(),
    releasedDate: z.date().optional(),
    designationReleasedById: z.string().optional(),
    // designationCreatedBy: z.custom<UserUI>().optional(),
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
      if (!values.designatedMeeting || values.designatedMeeting.length === 0) {
        context.addIssue({
          code: 'custom',
          message: 'Designated meeting is required',
          path: ['designatedMeeting'],
        });
      }
    }
  });

export type FundEditFormValues = z.infer<typeof fundEditSchema>;
