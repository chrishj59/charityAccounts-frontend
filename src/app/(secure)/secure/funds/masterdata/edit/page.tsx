import { headers } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';
import EditFund from '~/src/components/client/funds/EditFund';
import { fundSelectInterface } from '~/src/interface/fundSelect.interface';
import { auth } from '~/src/lib/auth';
import { getUserDb } from '~/src/lib/db';
import { Fund } from '~/zenstack/models';

export default async function EditFundPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in', RedirectType.replace);
  }

  const orgs = await auth.api.listOrganizations({
    // This endpoint requires session cookies.
    headers: await headers(),
  });

  console.log(`user organisations ${JSON.stringify(orgs)}`);
  const usr = session.user;
  const userOrgId = orgs[0].id;

  const userDb = await getUserDb(usr.id, userOrgId);
  const funds: Fund[] = await userDb.fund.findMany();

  const selectOptions: fundSelectInterface[] = [];
  funds.forEach((fnd) => {
    const selOption: fundSelectInterface = {
      id: fnd.id,
      name: fnd.fundName,
    };
    selectOptions.push(selOption);
  });

  return (
    <EditFund userId={usr.id} orgId={userOrgId} selectList={selectOptions} />
  );
}
