'use client'

import { useSession, useActiveOrganization } from '~/src/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';

export default function CoaCreateUI() {
  const { data: session, isPending } = useSession();
  const { data: activeOrg } = useActiveOrganization();
  const router = useRouter();

  
  const userId = session?.user.id;
  const orgId = activeOrg?.id;
  return (
   <Card title={
          <div className='flex justify-content-center align-items-center'>
            New Chart of accounts
          </div>
        }
        >
      C
    </Card>

  )
}