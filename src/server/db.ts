import { PrismaClient } from '../generated/prisma/index';
import { enhance } from '@zenstackhq/runtime';
import { stackServerApp } from '~/stack/server';
export const prisma = new PrismaClient();

export async function getUserDb() {
  const stackAuthUser = await stackServerApp.getUser();
  const currentTeam = stackAuthUser?.selectedTeam;

  // by default StackAuth's team members have "admin" or "member" role
  const perm =
    currentTeam && (await stackAuthUser.getPermission(currentTeam, 'admin'));

  const user = stackAuthUser
    ? {
        id: stackAuthUser.id,
        userId: stackAuthUser.id,
        currentTeamId: stackAuthUser.selectedTeam?.id,
        currentTeamRole: perm ? 'admin' : 'member',
      }
    : undefined; // anonymous
  return enhance(prisma, { user });
}
