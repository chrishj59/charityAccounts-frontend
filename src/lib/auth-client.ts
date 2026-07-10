import {
  adminClient,
  organizationClient,
  inferOrgAdditionalFields,
  inferAdditionalFields,
  lastLoginMethodClient,
} from 'better-auth/client/plugins';

import { createAuthClient } from 'better-auth/react';

import { customSessionClient } from 'better-auth/client/plugins';
import type { auth } from './auth';
import { toast } from 'sonner';

export const client = createAuthClient({
  plugins: [
    customSessionClient<typeof auth>(),
    organizationClient({
      schema: inferOrgAdditionalFields<typeof auth>(),
      teams: {
        enabled: true,
      },
    }),

    adminClient(),
    inferAdditionalFields<typeof auth>(),
    lastLoginMethodClient(),
  ],
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error('Too many requests. Please try again later.');
      }
    },
  },
});

export type ActiveOrganization = typeof client.$Infer.ActiveOrganization;
export type Organization = typeof client.$Infer.Organization;
export const {
  signUp,
  signIn,
  signOut,
  useSession,
  getSession,
  organization,
  useListOrganizations,
  useActiveOrganization,
} = client;
