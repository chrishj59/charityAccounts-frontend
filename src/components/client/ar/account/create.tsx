'use client';

import React, { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast, ToastMessage } from 'primereact/toast';

export default async function ArAccountCreatePage() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const toast = useRef<Toast>(null);

  const moveTab = (direction: string) => {
    if (direction === 'next' && activeIndex < 3) {
      setActiveIndex(activeIndex + 1);
    } else if (direction === 'back' && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <>
      <Toast ref={toast} position='center' />
      <Card className='z-50 rounded-md rounded-t-none ' title='Create Customer'>
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          <TabPanel header='Basic details' disabled>
            <div className='flex flex-col'></div>
            <Button onClick={() => moveTab('next')}>Next</Button>
          </TabPanel>
          <TabPanel header='Header II' disabled>
            <p className='m-0'>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
              aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
              eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci
              velit, sed quia non numquam eius modi.
            </p>
          </TabPanel>
          <TabPanel header='Header III' disabled>
            <p className='m-0'>
              At vero eos et accusamus et iusto odio dignissimos ducimus qui
              blanditiis praesentium voluptatum deleniti atque corrupti quos
              dolores et quas molestias excepturi sint occaecati cupiditate non
              provident, similique sunt in culpa qui officia deserunt mollitia
              animi, id est laborum et dolorum fuga. Et harum quidem rerum
              facilis est et expedita distinctio. Nam libero tempore, cum soluta
              nobis est eligendi optio cumque nihil impedit quo minus.
            </p>
          </TabPanel>
        </TabView>
      </Card>
    </>
  );
}
