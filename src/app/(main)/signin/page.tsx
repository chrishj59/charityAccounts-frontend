'use client';
import { SignIn, useStackApp } from '@stackframe/stack';
import { Button } from 'primereact/button';

export default function SigninPage() {
  const app = useStackApp();

  return (
    // <div className="flex  min-h-screen  justify-content-center align-items-center ">
    //   <div className="flex justify-content-center flex-wrap text-purple-500">
    <>
      <h1 className='text-primary'>Sign-in </h1>

      <SignIn />
    </>
    //   </div>
    // </div>
  );
}
