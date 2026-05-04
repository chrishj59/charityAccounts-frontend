// import { enhance } from '@zenstackhq/orm';
// import { NextRequestHandler } from '@zenstackhq/server/next';

// // create an enhanced Prisma client with user context
// async function getPrisma() {
//   // const authObj = await auth();
//   // return enhance(db, { user: authObj?.user });
// }

// const handler = NextRequestHandler({ getPrisma, useAppDir: true });

// export {
//   handler as DELETE,
//   handler as GET,
//   handler as PATCH,
//   handler as POST,
//   handler as PUT,
// };
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

  let organizationId;
  let organizationRole: string | undefined = undefined;
  const { session } = sessionResult;

  if (session.organizationId) {
    // if there's an active orgId, get the role of the user in the org
    organizationId = session.organizationId;
    const org = await auth.api.getFullOrganization({ headers: reqHeaders });
    if (org?.members) {
      const myMember = org.members.find((m) => m.userId === session.userId);
      organizationRole = myMember?.role;
    }
  }

  // create enhanced client with user context
  const userContext = {
    userId: session.userId,
    organizationId,
    organizationRole,
  };
  return authDb.$setAuth(userContext as any);
}

const handler = NextRequestHandler({
  apiHandler: new RPCApiHandler({ schema }),
  // apiHandler: new RestApiHandler({ schema, endpoint: 'http://localhost/api' }),
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
