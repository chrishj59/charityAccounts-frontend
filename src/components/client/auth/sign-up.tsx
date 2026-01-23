'use client';
import { Button } from 'primereact/button';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useRef, useState } from 'react';
import { SignUpUser } from './sign-up-user';
import { SignUpOrg } from './sign-up-org';
import { userInputValues } from '~/src/zodSchema/signupUser-schema';
import { orgInputValues } from '~/src/zodSchema/signupOrg-schema';

export function SignUp() {
  const userDefaultValues = {
    displayName: '',
    firstName: '',
    familyName: '',
    email: '',
    password: '',
    confirmedPassword: '',
    // address: defaultAddressValues,
  };
  const orgDefaultValues = {
    tradingName: '',
    identification: '',
    legalName: '',
    legalForm: '',
    idType: 0,
    accountType: 0,
  };
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const changeTab = (idx: number) => {
    setActiveIndex(idx);
  };
  const [user, setUser] = useState<userInputValues>(userDefaultValues);
  const [org, setOrg] = useState<orgInputValues>(orgDefaultValues);
  // Can only change tabs via buttons
  return (
    <TabView
      activeIndex={activeIndex}
      onTabChange={(e) => setActiveIndex(e.index)}
    >
      <TabPanel header='User Sign up' disabled>
        <div className='m-0'>
          <SignUpUser
            setUserAction={setUser}
            setActiveTabAction={setActiveIndex}
          />
        </div>
        {/* <div>
          <Button onClick={() => changeTab(1)}>Next</Button>
        </div> */}
      </TabPanel>
      <TabPanel header='Orgainsation set up' disabled>
        <div className='m-0'>
          <SignUpOrg user={user} setActiveTabAction={setActiveIndex} />
        </div>
        <div className='flex justify-end'>
          <Button onClick={() => changeTab(0)}>Back</Button>
        </div>
      </TabPanel>
    </TabView>
  );
}
