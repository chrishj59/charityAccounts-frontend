import { headers } from 'next/headers';
import { RedirectType } from 'next/navigation';
import { redirect } from 'next/navigation';
import ListFundsUI from '~/src/components/client/funds/listFunds';
import { auth } from '~/src/lib/auth';
import { authDb } from '~/src/lib/db';
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

  const funds: Fund[] = await authDb.fund.findMany();

  console.log(`funds from DB${JSON.stringify(funds, null, 2)}`);

  return (
    <>
      <div>
        <ListFundsUI fundList={funds} />
      </div>
    </>
  );
}
