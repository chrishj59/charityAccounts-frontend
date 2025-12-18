'use client';
import { Button } from 'primereact/button';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useRef, useState } from 'react';
import { SignUpUser } from './sign-up-user';

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
        <p className='m-0'>
          <SignUpUser />
        </p>
        <div>
          <Button onClick={() => changeTab(1)}>Next</Button>
        </div>
      </TabPanel>
      <TabPanel header='Orgainsation set up'>
        <p className='m-0'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <div className='flex justify-end'>
          <Button onClick={() => changeTab(0)}>Back</Button>
        </div>
      </TabPanel>
    </TabView>
  );
}
