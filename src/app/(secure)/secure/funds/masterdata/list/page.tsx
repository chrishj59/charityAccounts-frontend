import { headers } from 'next/headers';
import { RedirectType } from 'next/navigation';
import { redirect } from 'next/navigation';
import ListFundsUI from '~/src/components/client/funds/listFunds';
import { auth } from '~/src/lib/auth';
import { authDb, getUserDb } from '~/src/lib/db';
import { userContextType } from '~/src/types/helper';
import { Fund } from '~/zenstack/models';

export default async function ListFundsPage() {
  type SessionData = Awaited<ReturnType<typeof auth.api.getSession>>;
  const session: SessionData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in', RedirectType.replace);
  }
  const orgs = await auth.api.listOrganizations({
    // This endpoint requires session cookies.
    headers: await headers(),
  });
  const usr = session.user;
  const userOrgId = orgs[0].id;

  const userDb = await getUserDb(usr.id, userOrgId);
  const funds: Fund[] = await userDb.fund.findMany();

  console.log(
    `${JSON.stringify(funds.length)} funds from DB${JSON.stringify(funds, null, 2)}`,
  );

  return (
    <>
      <div>
        <ListFundsUI fundList={funds} />
      </div>
    </>
  );
}
