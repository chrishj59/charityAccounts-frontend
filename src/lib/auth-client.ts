import {
  adminClient,
  organizationClient,
  inferOrgAdditionalFields,
  inferAdditionalFields,
  lastLoginMethodClient,
} from 'better-auth/client/plugins';

// import { createAuthClient } from 'better-auth/react';
import { createAuthClient } from 'better-auth/client';

import type { auth } from './auth';
import { toast } from 'sonner';
import { Dialog } from 'primereact/dialog';

export const client = createAuthClient({
  plugins: [
    organizationClient({
      schema: inferOrgAdditionalFields<typeof auth>(),
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

export const {
  signUp,
  signIn,
  signOut,
  useSession,
  organization,
  useListOrganizations,
  useActiveOrganization,
} = client;
