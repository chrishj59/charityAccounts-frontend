'use client';

import { NextPage } from 'next';
import { TabView, TabPanel } from 'primereact/tabview';
import SignUpPage from '~/app/components/auth/SignupPage';

export default function Page() {
  return (
    // <div className='w-full'>
    <div className='flex items-center flex-col justify-center  md:py-10'>
      <div>
        <div className='card w-max'>
          <TabView>
            <TabPanel header='Sign In'>
              <div>Sign In place holder</div>
            </TabPanel>
            <TabPanel header='Sign Up'>
              <SignUpPage />
            </TabPanel>
          </TabView>
        </div>
      </div>
    </div>
    // </div>
  );
}
