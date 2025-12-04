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
import { InputText } from 'primereact/inputtext';
// import { Label } from '@/components/ui/label';
import { Password } from 'primereact/password';
import { DiscordLogoIcon, GitHubLogoIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { client, signIn, signUp } from '~/src/lib/auth-client';
import Image from 'next/image';
import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { RationesUser } from '~/src/types';
import { Address } from '~/src/types/user';
import { classNames } from 'primereact/utils';

export function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const [defaultUser, setDefaultUser] = useState<RationesUser>();

  const defaultUserAddress: Address = {
    houseNumber: defaultUser?.address.houseNumber
      ? defaultUser?.address.houseNumber
      : 0,
    postCode: defaultUser?.address.postCode
      ? defaultUser?.address.postCode
      : '',
  };
  const defaultUserValues: RationesUser = {
    displayName: defaultUser?.displayName ? defaultUser?.displayName : '',
    created: defaultUser?.created ? defaultUser.created : false,
    loggedin: defaultUser?.loggedin ? defaultUser?.loggedin : false,
    address: defaultUserAddress,
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const [loading, setLoading] = useState(false);
  const footer = (
    <div className='flex justify-center w-full border-t py-4'>
      <p className='text-center text-xs text-neutral-500'>
        Secured by <span className='text-orange-400'>better-auth.</span>
      </p>
    </div>
  );

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    getValues,
  } = useForm<RationesUser>({ defaultValues: defaultUserValues });

  const onUserSubmit = async (formData: RationesUser) => {
    alert(`submit called with ${JSON.stringify(formData)}`);
  };

  const getFormErrorMessage = (name: string) => {
    return (
      errors[name as keyof RationesUser] && (
        <small className='p-error'>
          {errors[name as keyof RationesUser]?.message}
        </small>
      )
    );
  };
  return (
    <Card
      className='z-50 rounded-md rounded-t-none max-w-md'
      title='Sign Up'
      subTitle='Enter your information to create an account'
      footer={footer}
    >
      {/* <CardHeader>
                <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                    Enter your information to create an account
                </CardDescription>
            </CardHeader> */}
      {/* <CardContent> */}
      <form onSubmit={handleSubmit(onUserSubmit)}>
        <div className='formgrid grid'>
          {/* ** Display name row ** */}
          <div className='field col-12 w-full'>
            <Controller
              name='displayName'
              control={control}
              rules={{
                required: 'Name is required.',
              }}
              render={({ field, fieldState }) => (
                <>
                  <label
                    htmlFor={field.name}
                    className={classNames({
                      'p-error': errors.displayName,
                    })}
                  ></label>
                  <span className='p-float-label'>
                    <InputText
                      id={field.name}
                      autoFocus={true}
                      width={'100%'}
                      className={classNames({
                        'p-invalid': fieldState.error,
                      })}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    <label htmlFor={field.name}>Display Name</label>
                  </span>
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>

          {/* first Name line */}

          <div className='field col-12'>
            <Controller
              name='firstName'
              control={control}
              rules={{
                required: 'First Name is required.',
              }}
              render={({ field, fieldState }) => (
                <>
                  <label
                    htmlFor={field.name}
                    className={classNames({
                      'p-error': errors.displayName,
                    })}
                  ></label>
                  <span className='p-float-label'>
                    <InputText
                      id={field.name}
                      autoFocus={true}
                      width={'100%'}
                      className={classNames({
                        'p-invalid': fieldState.error,
                      })}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    <label htmlFor={field.name}>First Name</label>
                  </span>
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>

          {/* family Name line */}

          <div className='field col-12'>
            <Controller
              name='familyName'
              control={control}
              rules={{
                required: 'Family Name is required.',
              }}
              render={({ field, fieldState }) => (
                <>
                  <label
                    htmlFor={field.name}
                    className={classNames({
                      'p-error': errors.displayName,
                    })}
                  ></label>
                  <span className='p-float-label'>
                    <InputText
                      id={field.name}
                      autoFocus={true}
                      width={'100%'}
                      className={classNames({
                        'p-invalid': fieldState.error,
                      })}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    <label htmlFor={field.name}>Family Name</label>
                  </span>
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>

          {/* Email address */}
          <div className='field'>
            <Controller
              name='email'
              control={control}
              rules={{
                required: 'Email is required.',
                pattern: {
                  value:
                    // /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: 'Please correct the invalid email address ',
                },
              }}
              render={({ field, fieldState }) => (
                <>
                  <label
                    htmlFor={field.name}
                    className={classNames({
                      'p-error': errors.email,
                    })}
                  ></label>
                  <span className='p-float-label'>
                    <InputText
                      id={field.name}
                      width={'100%'}
                      value={field.value}
                      className={classNames({
                        'p-invalid': fieldState.error,
                      })}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    <label htmlFor={field.name}>Email</label>
                  </span>
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>

          {/* Password  */}
          <div className='field'>
            <Controller
              name='password'
              control={control}
              rules={{
                required: 'Password is required.',
                // pattern: {
                // 	value:
                // 		// /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                // 		/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                // 	message: 'Please correct the invalid email address ',
                // },
              }}
              render={({ field, fieldState }) => (
                <>
                  <label
                    htmlFor={field.name}
                    className={classNames({
                      'p-error': errors.email,
                    })}
                  ></label>
                  <span className='p-float-label'>
                    <Password
                      id={field.name}
                      inputRef={field.ref}
                      width={'100%'}
                      value={field.value}
                      strongRegex='^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{12,50})(?=.*?[^0-9A-Za-z])'
                      mediumRegex='^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})(?=.*?[^0-9A-Za-z])'
                      autoComplete='password'
                      placeholder='Password'
                      weakLabel='Password is weak. '
                      mediumLabel='Password is medium strength. Please improve complexity'
                      strongLabel='Password is strong '
                      className={classNames({
                        'p-invalid': fieldState.error,
                      })}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    <label htmlFor={field.name}>Password</label>
                  </span>
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>

          {/* Confirm Password  */}
          <div className='field'>
            <Controller
              name='confirmpassword'
              control={control}
              rules={{
                required: 'Confirm Password is required.',
                // pattern: {
                // 	value:
                // 		// /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                // 		/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                // 	message: 'Please correct the invalid email address ',
                // },
              }}
              render={({ field, fieldState }) => (
                <>
                  <label
                    htmlFor={field.name}
                    className={classNames({
                      'p-error': errors.email,
                    })}
                  ></label>
                  <span className='p-float-label'>
                    <Password
                      id={field.name}
                      inputRef={field.ref}
                      width={'100%'}
                      value={field.value}
                      // strongRegex='^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{12,50})(?=.*?[^0-9A-Za-z])'
                      // mediumRegex='^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})(?=.*?[^0-9A-Za-z])'
                      autoComplete='password'
                      placeholder='Password'
                      // weakLabel='Password is weak. '
                      // mediumLabel='Password is medium strength. Please improve complexity'
                      // strongLabel='Password is strong '
                      className={classNames({
                        'p-invalid': fieldState.error,
                      })}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    <label htmlFor={field.name}>Password</label>
                  </span>
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
        </div>
      </form>
      {/* <div className='grid gap-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='grid gap-2'>
            <label htmlFor='first-name'>First name</label>
            <InputText
              id='first-name'
              placeholder='Max'
              required
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              value={firstName}
            />
          </div>
          <div className='grid gap-2'>
            <label htmlFor='last-name'>Last name</label>
            <InputText
              id='last-name'
              placeholder='Robinson'
              required
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              value={lastName}
            />
          </div>
        </div>
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
          <Label htmlFor='password'>Password</Label>
          <PasswordInput
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete='new-password'
            placeholder='Password'
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='password'>Confirm Password</Label>
          <PasswordInput
            id='password_confirmation'
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            autoComplete='new-password'
            placeholder='Confirm Password'
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='image'>Profile Image (optional)</Label>
          <div className='flex items-end gap-4'>
            {imagePreview && (
              <div className='relative w-16 h-16 rounded-sm overflow-hidden'>
                <Image
                  src={imagePreview}
                  alt='Profile preview'
                  layout='fill'
                  objectFit='cover'
                />
              </div>
            )}
            <div className='flex items-center gap-2 w-full'>
              <Input
                id='image'
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                className='w-full'
              />
              {imagePreview && (
                <X
                  className='cursor-pointer'
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <Button
          type='submit'
          className='w-full'
          disabled={loading}
          onClick={async () => {
            await signUp.email({
              email,
              password,
              name: `${firstName} ${lastName}`,
              image: image ? await convertImageToBase64(image) : '',
              callbackURL: '/dashboard',
              fetchOptions: {
                onResponse: () => {
                  setLoading(false);
                },
                onRequest: () => {
                  setLoading(true);
                },
                onError: (ctx) => {
                  toast.error(ctx.error.message);
                },
                onSuccess: async () => {
                  router.push('/dashboard');
                },
              },
            });
          }}
        >
          {loading ? (
            <Loader2 size={16} className='animate-spin' />
          ) : (
            'Create an account'
          )}
        </Button>
      </div> */}
      {/* </CardContent> */}
      {/* <CardFooter>
        <div className='flex justify-center w-full border-t py-4'>
          <p className='text-center text-xs text-neutral-500'>
            Secured by <span className='text-orange-400'>better-auth.</span>
          </p>
        </div>
      </CardFooter> */}
    </Card>
  );
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
