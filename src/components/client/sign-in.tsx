'use client';

import { Button } from 'primereact/button';
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from '@/components/ui/card';
import { Card } from 'primereact/card';
import { Checkbox } from 'primeReact/checkbox';
import { InputText } from 'primereact/inputtext';
// import { Label } from '@/components/ui/label';
import { Password } from 'primereact/password';
import { signIn } from '~/src/lib/auth-client';
// import { DiscordLogoIcon, GitHubLogoIcon } from '@radix-ui/react-icons';
//  import { Key, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

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
      className='z-50 rounded-md rounded-t-none max-w-md'
      title='Sign In'
      subTitle='Enter your email below to login to your account'
    >
      {/* <CardHeader>
                <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader> */}
      {/* <CardContent> */}
      <div className='grid gap-4'>
        <div className='grid gap-2'>
          <label htmlFor='email'>Email</label>
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
        </div>
        <div className='grid gap-2'>
          <div className='flex items-center'>
            <label htmlFor='password'>Password</label>
            <Link
              id='password'
              href='/forget-password'
              className='ml-auto inline-block text-sm underline'
            >
              Forgot your password?
            </Link>
          </div>
          <Password
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete='password'
            placeholder='Password'
          />
        </div>
        <div className='flex items-center gap-2'>
          <Checkbox
            id='rememberMe'
            checked={rememberMe}
            onClick={() => {
              setRememberMe(!rememberMe);
            }}
          />
          <label htmlFor='rememberMe' className='ml-2'>
            Remember me
          </label>
        </div>

        <Button
          type='submit'
          className='w-full'
          disabled={loading}
          onClick={async () => {
            await signIn.email(
              {
                email: email,
                password: password,
                callbackURL: '/dashboard',
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
