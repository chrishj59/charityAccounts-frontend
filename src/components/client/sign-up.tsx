'use client';
import { Button } from 'primereact/button';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useRef, useState } from 'react';
import { SignUpUser } from './sign-up-user';
import { SignUpOrg } from './sign-up-org';

export function SignUp() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const changeTab = (idx: number) => {
    setActiveIndex(idx);
  };

  return (
    <TabView
      activeIndex={activeIndex}
      onTabChange={(e) => setActiveIndex(e.index)}
    >
      <TabPanel header='User Sign up'>
        <div className='m-0'>
          <SignUpUser />
        </div>
        <div>
          <Button onClick={() => changeTab(1)}>Next</Button>
        </div>
      </TabPanel>
      <TabPanel header='Orgainsation set up'>
        <div className='m-0'>
          <SignUpOrg />
        </div>
        <div className='flex justify-end'>
          <Button onClick={() => changeTab(0)}>Back</Button>
        </div>
      </TabPanel>
    </TabView>
  );
}
