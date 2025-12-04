'use client';

import SignIn from '~/src/components/client/sign-in';
import { SignUp } from '~/src/components/client/sign-up';
// import { Tabs } from '@/components/ui/tabs2';

import { TabView, TabPanel } from 'primereact/tabview';

export default function Page() {
  return (
    <div className='w-full'>
      <div className='flex items-center flex-col justify-center w-full md:py-10'>
        <div className='md:w-[400px]'>
          <TabView>
            <TabPanel header='Sign in'>
              <SignIn />
            </TabPanel>
            <TabPanel header='Sign up'>
              <SignIn />
            </TabPanel>
          </TabView>
          {/* <Tabs
                        tabs={[
                            {
                                title: 'Sign In',
                                value: 'sign-in',
                                content: <SignIn />,
                            },
                            {
                                title: 'Sign Up',
                                value: 'sign-up',
                                content: <SignUp />,
                            },
                        ]}
                    /> */}
        </div>
      </div>
    </div>
  );
}
