'use server';
import { Html, render } from '@react-email/components';
import {
  ListContactListsCommand,
  SESv2Client,
  SendEmailCommand,
} from '@aws-sdk/client-sesv2';

const ses = new SESv2Client({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
    sessionToken: process.env.AWS_SECRET_TOKEN!,
  },
});

import { VerificationEmail } from '~/src/lib/email/verification';
import { WelcomeEmail } from '~/src/lib/email/verification';

export async function awsVerificationEmail(
  name: string,
  toEmail: string,
  url: string,
) {
  console.log(
    `Called sendVerificationEmail with name ${name} toEmail ${toEmail} url ${url}`,
  );
  const emailHtml = await render(VerificationEmail({ name, url }));

  const params = {
    FromEmailAddress: `${process.env.ADMIN_EMAIL}`,
    Content: {
      Simple: {
        Subject: { Data: 'Verify your email address' },
        Body: {
          Html: { Data: emailHtml },
        },
      },
    },
    Destination: {
      ToAddresses: [toEmail],
    },
  };

  const command = new SendEmailCommand(params);
  const response = await ses.send(command);
  return response;
}
