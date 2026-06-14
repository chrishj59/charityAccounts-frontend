'use server';

import { APIError } from 'better-auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '~/src/lib/auth';

type SignInEmailResponse = {
  success: boolean;
};
export async function signinUserAction(
  email: string,
  password: string,
): Promise<boolean> {
  await auth.api.signInEmail({
    body: { email, password },
  });
  console.log(`after auth.api.signInEmail`);
  let session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return false;
  }
  let organizationId: string | undefined = undefined;
  let organizationRole: string | undefined = undefined;

  const currentSession = session.session;
  console.log(`currentSession ${JSON.stringify(currentSession, null, 2)}`);
  const currentSessionUser = session.user;
  console.log(`currentSessionUserId ${currentSessionUser.id}`);

  // const memberships = await db.member.findMany({
  //   where: { userId: session.user.id },
  // });
  const orgs = await auth.api.listOrganizations({
    headers: await headers(),
  });

  console.log(`organisations member of ${JSON.stringify(orgs)}`);
  if (orgs.length > 0) {
    const userOrg = orgs[0];
    console.log(`before call setActiveOrganization with`);

    try {
      await auth.api.setActiveOrganization({
        body: {
          organizationId: userOrg.id,
          // organizationSlug: userOrg.slug,
        },
        headers: await headers(),
      });
      console.log('called auth.api.setActiveOrganization ');
    } catch (err: any) {
      if (err instanceof APIError) {
        console.log(err.status, err.message);
        return false;
      } else {
        console.log(
          `other auth.api.setActiveOrganization error ${JSON.stringify(err, null, 2)}`,
        );
      }
    }

    session = await auth.api.getSession({
      headers: await headers(),
    });

    const fullOrg = await auth.api.getFullOrganization({
      headers: await headers(),
    });

    if (fullOrg?.members) {
      const myMember = fullOrg.members.find(
        (m) => m.userId === currentSessionUser.id,
      );
      organizationRole = myMember?.role;
    }

    //   const fund = await authDb.generalFund.create({
    //     data: {
    //       fundName: 'General Fund',
    //       managedById: userId,
    //       organizationId: userOrg.id,
    //     },
    //   });
    //   console.log(`Created default fund ${JSON.stringify(fund)}`);
    // }
  }
  redirect('/secure');
  return true;
}
