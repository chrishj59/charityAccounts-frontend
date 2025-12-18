import { adminClient, organizationClient } from 'better-auth/client/plugins';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import type { auth } from './auth';
import { toast } from 'sonner';
import { Dialog } from 'primereact/dialog';

export const client = createAuthClient({
  plugins: [
    organizationClient(),
    adminClient(),
    inferAdditionalFields<typeof auth>(),
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
