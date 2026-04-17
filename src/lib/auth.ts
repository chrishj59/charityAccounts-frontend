import { betterAuth } from 'better-auth';
import { customSession } from 'better-auth/plugins';

import { nextCookies } from 'better-auth/next-js';
import {
  admin,
  bearer,
  organization,
  lastLoginMethod,
} from 'better-auth/plugins';
import { db } from './db';
import { reactInvitationEmail } from './email/invitation';

import { ses } from './email/aws-ses';

import { reactResetPasswordEmail } from './email/reset-password';
import { zenstackAdapter } from '@zenstackhq/better-auth';
// import {
//   ListContactListsCommand,
//   SESv2Client,
//   SendEmailCommand,
// } from '@aws-sdk/client-sesv2';
import { awsVerificationEmail } from '../actions/send-email/send-verification';
import { resend } from './email/resend';
import { TruckElectric } from 'lucide-react';
import { label } from 'framer-motion/client';

const from = process.env.BETTER_AUTH_EMAIL || 'delivered@resend.dev';
const to = process.env.TEST_EMAIL || '';

const getOrgId = async (userId: string) => {
  return '7MB5idvLxFQ9UfZVckSrcki1rKxnz6vT';
};
export const auth = betterAuth({
  appName: 'Rationes-Charitatis',
  database: zenstackAdapter(db, {
    provider: 'postgresql',
  }),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'user',
        input: false, // don't allow user to set role
      },
      displayName: {
        type: 'string',
        required: true,
        defaultValue: ' ',
        input: true,
      },
      firstName: {
        type: 'string',
        required: true,
        defaultValue: ' ',
        input: true,
      },
      familyName: {
        type: 'string',
        required: true,
        defaultValue: ' ',
        input: true,
      },
    },
  },

  emailVerification: {
    //   async sendVerificationEmail({ user, url }) {
    //     console.log(
    //       `About to send aws verification email to ${user.email} at url ${url}`,
    //     );
    //     const resp = await awsVerificationEmail(user.name, user.email, url);
    //     console.log(`AWS  resp ${JSON.stringify(resp)}`);
    //     // const res = await resend.emails.send({
    //     //   from,
    //     //   to: to || user.email,
    //     //   subject: 'Verify your email address',
    //     //   html: `<a href="${url}">Verify your email address</a>`,
    //     // });
    //     // console.log(res, user.email);
    //   },
    //   sendOnSignUp: true,
    async sendVerificationEmail({ user, url }) {
      console.log('Sending verification email to', user.email);
      const res = await resend.emails.send({
        from,
        to: to || user.email,
        subject: 'Verify your email address',
        html: `<a href="${url}">Verify your email address</a>`,
      });
      console.log(res, user.email);
    },
    sendOnSignUp: true,
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      await resend.emails.send({
        from,
        to: user.email,
        subject: 'Reset your password',
        react: reactResetPasswordEmail({
          username: user.email,
          resetLink: url,
        }),
      });
    },
  },

  plugins: [
    organization({
      schema: {
        organization: {
          // name: 'Trading name',
          customRoles: [
            { role: 'orgAdmin', label: 'Organisation Admin' },
            { role: 'fundAdmin', label: 'Fund Administrator' },
            { role: 'auditor', label: 'Auditor' },
            { role: 'salesSuper', label: 'Sales Supervisor' },
            { role: 'salesInvoice', label: 'Sales invoice' },
            { role: 'salesCash', label: 'Sales cash' },
          ],
          additionalFields: {
            tradingName: {
              type: 'string',
              input: true,
              required: true,
            },
            legalForm: {
              type: 'string',
              input: true,
              required: true,
            },
            legalName: {
              type: 'string',
              input: true,
              required: true,
            },
            charityNumber: {
              type: 'string',
              input: true,
              required: false,
            },
            taxRef: {
              type: 'string',
              input: true,
              required: false,
            },
            companyNumber: {
              type: 'string',
              input: true,
              required: false,
            },
            companyName: {
              type: 'string',
              input: true,
              required: false,
            },
            idType: {
              type: 'string',
              input: true,
              required: true,
            },
            identification: {
              type: 'string',
              input: true,
              required: true,
            },
            trial: {
              type: 'boolean',
              input: true,
              required: false,
            },
            trialStart: {
              type: 'date',
              input: false,
              required: false,
            },
            accountType: {
              type: 'string',
              input: true,
              required: false,
            },
          },
        },
      },
      async sendInvitationEmail() {
        // const res = await resend.emails.send({
        //   from,
        //   to: data.email,
        //   subject: "You've been invited to join an organization",
        //   react: reactInvitationEmail({
        //     username: data.email,
        //     invitedByUsername: data.inviter.user.name,
        //     invitedByEmail: data.inviter.user.email,
        //     teamName: data.organization.name,
        //     inviteLink:
        //       process.env.NODE_ENV === 'development'
        //         ? `http://localhost:3000/accept-invitation/${data.id}`
        //         : `${
        //             process.env.BETTER_AUTH_URL ||
        //             'https://demo.better-auth.com'
        //           }/accept-invitation/${data.id}`,
        //   }),
        // });
        // console.log(res, data.email);
      },
      teams: {
        modelName: 'Fund',
        enabled: true,
        allowRemovingAllTeams: true,
        additionalFields: {
          isRestricted: {
            type: 'boolean',
            input: true,
            required: true,
          },
          fundCategory: {
            type: 'string',
            input: true,
            required: true,
          },
          fundSource: {
            type: 'string',
            input: true,
            required: false,
          },
        },
      },
      // organizationLimit: 1,
    }),
    lastLoginMethod({
      storeInDatabase: true,
    }),
    customSession(async ({ user, session }) => {
      // const roles = findUserRoles(session.session.userId);
      const organizationId = await getOrgId(user.id);
      return {
        // roles,
        // user: {
        //   ...user,
        //   // newField: "newField",
        // }
        user,
        session: {
          ...session,
          organizationId,
        },
      };
    }),
    bearer(),
    admin(),
    nextCookies(),
  ],
});
