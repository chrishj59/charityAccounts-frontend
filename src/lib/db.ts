import { ZenStackClient } from '@zenstackhq/orm';
import { schema } from '~/zenstack/schema';
import { PostgresDialect } from 'kysely';
import { PolicyPlugin } from '@zenstackhq/plugin-policy';
import { Pool } from 'pg';
import { MemoryCacheProvider } from '@visualbravo/zenstack-cache/providers/memory';
import { defineCachePlugin } from '@visualbravo/zenstack-cache';
import { userContextType } from '../types/helper';
import { headers } from 'next/headers';
import { auth } from './auth';
import { redirect, RedirectType } from 'next/navigation';

export const db = new ZenStackClient(schema, {
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
  log: ['query', 'error'],
}).$use(defineCachePlugin({ provider: new MemoryCacheProvider() }));

export const authDb = db.$use(new PolicyPlugin());

export const getUserDb = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect('/sign-in', RedirectType.replace);
  }

  const currSession = session.session;
  let organizationRole: string | undefined = undefined;
  const org = await auth.api.getFullOrganization({ headers: await headers() });
  if (org?.members) {
    const myMember = org.members.find((m: any) => m.userId === session.user.id);
    organizationRole = myMember?.role;
  }
  const userContext: userContextType = {
    userId: session.user.id,
    organizationId: session.session.organizationId,
    organizationRole: organizationRole,
  };
  console.log(`userContext in db.ts ${JSON.stringify(userContext, null, 2)}`);
  console.log(`session in db.ts ${JSON.stringify(session, null, 2)}`);
  return authDb.$setAuth(userContext);
};
