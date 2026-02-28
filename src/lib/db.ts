import { ZenStackClient } from '@zenstackhq/orm';
import { schema } from '~/zenstack/schema';
import { PostgresDialect } from 'kysely';
import { PolicyPlugin } from '@zenstackhq/plugin-policy';
import { Pool } from 'pg';
import { MemoryCacheProvider } from '@visualbravo/zenstack-cache/providers/memory';
import { defineCachePlugin } from '@visualbravo/zenstack-cache';

export const db = new ZenStackClient(schema, {
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
  log: ['query', 'error'],
}).$use(defineCachePlugin({ provider: new MemoryCacheProvider() }));

export const authDb = db.$use(new PolicyPlugin());
