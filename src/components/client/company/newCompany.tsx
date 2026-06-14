'use client';

import { FiscalPeriodRuleUI } from '~/src/types/ui-types/fiscal-period';
import {useSession} from '~/src/lib/auth-client'
import { useRouter } from 'next/navigation'
import { Card } from 'primereact/card';
interface NewCompanyProps {
  fiscRuleList: FiscalPeriodRuleUI[];
  orgId: string;
}
export default function NewCompanyUI({fiscRuleList, orgId }:NewCompanyProps) {
  console.log(`NewCompanyUI fiscRuleList`)
 const {data: session,
        isPending, //loading state
        error: sessionError, //error object
        refetch //refetch the session
 } = useSession()
 const router = useRouter()

 if(!session)(
  router.push('/unauthorised')
 )

  return (
   <Card title={
          <div className='flex justify-content-center align-items-center'>
            New Company
          </div>
        }
        >
      Card body
    </Card>

  )
}
