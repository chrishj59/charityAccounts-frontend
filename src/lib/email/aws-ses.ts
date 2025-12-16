import {
  ListContactListsCommand,
  SESv2Client,
  SendEmailCommand,
} from '@aws-sdk/client-sesv2';

export const ses = new SESv2Client({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
    sessionToken: process.env.AWS_SECRET_TOKEN!,
  },
});
