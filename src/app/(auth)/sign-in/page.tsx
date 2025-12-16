'use client';

import SignIn from '~/src/components/client/sign-in';
import { SignUp } from '~/src/components/client/sign-up';
// import { Tabs } from '@/components/ui/tabs2';

import { TabView, TabPanel } from 'primereact/tabview';
import { Toolbar } from 'primereact/toolbar';

export default function Page() {
  return (
    <div className='w-screen'>
      <div className='flex place-content-center'>
        <div>
          <TabView
            className='mt-6'
            pt={{
              root: { className: 'w-2xl' },
            }}
          >
            <TabPanel header='Sign in'>
              <SignIn />
            </TabPanel>
            <TabPanel header='Sign up'>
              <SignUp />
            </TabPanel>
          </TabView>
        </div>
      </div>
    </div>
  );
}
