'use client';
import { TabPanel, TabView } from 'primereact/tabview';
import SignIn from './sign-in';
import { SignUp } from './sign-up';

export default function SignInSignUp() {
  return (
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
  );
}
