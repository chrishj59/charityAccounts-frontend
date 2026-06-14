import { auth } from '~/src/lib/auth';
import { authDb } from '~/src/lib/db';
import { schema } from '~/zenstack/schema';
import { RestApiHandler, RPCApiHandler } from '@zenstackhq/server/api';
import { NextRequestHandler } from '@zenstackhq/server/next';
import { headers } from 'next/headers';

async function getClient() {
  const reqHeaders = await headers();
  const sessionResult = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!sessionResult) {
    // anonymous user, create enhanced client without user context
    return authDb;
  }

  let organizationId: string = '';
  let organizationRoles: string | undefined = undefined;
  const { session } = sessionResult;

  console.log(
    `api/model/route session is ${JSON.stringify(session, null, 2)} `,
  );

  // if (session.) {
  //   // if there's an active orgId, get the role of the user in the org
  //   // const rawOrgId = session.organizationId;
  //   // organizationId =
  //   //   typeof rawOrgId === 'string' ? rawOrgId : rawOrgId?.organizationId;

  //   const org = await auth.api.getFullOrganization({ headers: reqHeaders });
  //   if (org?.members) {
  //     const myMember = org.members.find((m) => m.userId === session.userId);
  //     organizationRole = myMember?.role;
  //   }
  // }

  // create enhanced client with user context

  const userContext = {
    userId: session.userId,
    organizationId: session.activeOrganizationId ?? '',
    organizationRole: session.organizationRoles ?? '',
  };
  console.log('userContext:', userContext); // verify before removing
  return authDb.$setAuth(userContext as any);
}

const handler = NextRequestHandler({
  apiHandler: new RPCApiHandler({ schema }),
  // apiHandler: new RestApiHandler({
  //   schema,
  //   endpoint: `${process.env.NEXT_PUBLIC_APP_URL}/api/model`,
  // }),
  getClient,
  useAppDir: true,
});

export {
  handler as DELETE,
  handler as GET,
  handler as PATCH,
  handler as POST,
  handler as PUT,
};
