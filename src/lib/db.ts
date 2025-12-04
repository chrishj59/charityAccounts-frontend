// import { PrismaClient } from '../generated/prisma/index';

// export const prisma = new PrismaClient();
import { ZenStackClient } from '@zenstackhq/orm';
import { schema } from '~/zenstack/schema';
import { PostgresDialect } from 'kysely';
import { PolicyPlugin } from '@zenstackhq/plugin-policy';
import { Pool } from 'pg';

export const db = new ZenStackClient(schema, {
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
  log: ['query', 'error'],
});

export const authDb = db.$use(new PolicyPlugin());
