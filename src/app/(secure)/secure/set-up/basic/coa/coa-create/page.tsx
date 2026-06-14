import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CoaCreateUI from "~/src/components/client/setup/config/coaCreate";
import { auth } from "~/src/lib/auth";


export default async function CreateCoaPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  
  if (!session) {
    redirect('/unauthorised');
  }
  

  return <CoaCreateUI />
}