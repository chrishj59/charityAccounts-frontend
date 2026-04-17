import { headers } from 'next/headers';
import { RedirectType } from 'next/navigation';
import { redirect } from 'next/navigation';
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

  const userDb = await getUserDb();

  const funds: Fund[] = await userDb.fund.findMany();

  console.log(`funds from DB${JSON.stringify(funds, null, 2)}`);

  return (
    <>
      <div>
        List funds page funds {`Funds ${JSON.stringify(funds, null, 2)}`}
      </div>
    </>
  );
}
