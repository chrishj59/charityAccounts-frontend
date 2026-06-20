import { ZenStackClient } from '@zenstackhq/orm';
import { schema } from '~/zenstack/schema';
import { SoftDeletePlugin } from '@zenstackhq/plugin-soft-delete';
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
}).$use(new SoftDeletePlugin());
// .$use(defineCachePlugin({ provider: new MemoryCacheProvider() }));

export const allDb = db;
export const authDb = db.$use(new PolicyPlugin());

export const getUserDb = async (userId: string, orgId: string) => {
  const members = await db.member.findMany();
  let organizationRole = '';
  if (members) {
    const currMember = members.find((m) => m.userId === userId);
    if (currMember) {
      organizationRole = currMember.role;
    }
  }
  console.log(`organizationRole ${organizationRole}`);

  const userContext = {
    userId: userId,
    organizationId: orgId,
    organizationRole,
  };
  return authDb.$setAuth(userContext);
};
