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
// export async function getUserDb() {
//   const stackAuthUser = await stackServerApp.getUser();
//   const currentTeam = stackAuthUser?.selectedTeam;

//   // by default StackAuth's team members have "admin" or "member" role
//   const perm =
//     currentTeam && (await stackAuthUser.getPermission(currentTeam, 'admin'));

//   const user = stackAuthUser
//     ? {
//         id: stackAuthUser.id,
//         userId: stackAuthUser.id,
//         currentTeamId: stackAuthUser.selectedTeam?.id,
//         currentTeamRole: perm ? 'admin' : 'member',
//       }
//     : undefined; // anonymous
//   return enhance(prisma, { user });
// }
