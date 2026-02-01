'use client';

import { Button } from 'primereact/button';

import { Card } from 'primereact/card';

import { InputText } from 'primereact/inputtext';

import { Password } from 'primereact/password';
import { signIn } from '~/src/lib/auth-client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Checkbox } from 'primereact/checkbox';
import { InputSwitch } from 'primereact/inputswitch';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const footerCard = (
    <div className='flex justify-center w-full border-t py-4'>
      <p className='text-center text-xs text-neutral-500'>
        Secured by <span className='text-orange-400'>better-auth.</span>
      </p>
    </div>
  );
  return (
    <Card
      // className='z-50 rounded-md rounded-t-none max-w-md'
      title='Sign In'
      subTitle='Enter your email below to login to your account'
      footer={footerCard}
    >
      {/* <CardHeader>
                <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader> */}
      {/* <CardContent> */}

      <table className='table-auto border-separate border-spacing-y-3 border-spacing-x-2'>
        <tbody>
          <tr>
            <td>
              <label htmlFor='email mr-2'>Email</label>
            </td>
            <td>
              <label htmlFor='email'>
                <InputText
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                />
              </label>
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor='password'>Password</label>
            </td>
            <td>
              <Password
                id='password'
                value={password}
                feedback={false}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete='password'
                placeholder='Password'
              />
            </td>
          </tr>

          <tr>
            <td>
              <label htmlFor='rememberMe'>Remember me</label>
            </td>
            <td>
              <InputSwitch
                id='rememberMe'
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className='flex justify-center-safe'>
        <div>
          <Button
            type='submit'
            // className='w-full'
            disabled={loading}
            onClick={async () => {
              const { data, error } = await signIn.email(
                {
                  email: email,
                  password: password,
                  callbackURL: '/secure',
                  rememberMe,
                },
                {
                  onRequest: () => {
                    setLoading(true);
                  },
                  onResponse: () => {
                    setLoading(false);
                  },
                  onError: (ctx) => {
                    toast.error(ctx.error.message);
                  },
                  onSuccess: async () => {
                    router.push('/secure');
                  },
                },
              );
            }}
          >
            {loading ? (
              <span className='pi pi-spinner-dotted pi-spin' />
            ) : (
              // <Loader2 size={16} className="animate-spin" />
              'Login'
            )}
          </Button>
        </div>
      </div>

      {/* </CardContent> */}
      {/* <CardFooter>
                <div className="flex justify-center w-full border-t py-4">
                    <p className="text-center text-xs text-neutral-500">
                        Secured by{' '}
                        <span className="text-orange-400">better-auth.</span>
                    </p>
                </div>
            </CardFooter> */}
    </Card>
  );
}
