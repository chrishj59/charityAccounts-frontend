'use client';

import { Card } from 'primereact/card';

export default function () {
  const footer = <div className='h-10 w-24'></div>;
  return (
    <Card
      className='w-full max-w-md mx-auto'
      title=''
      subTitle=''
      footer={footer}
    ></Card>
  );
}
