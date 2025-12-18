'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userInputSchema, userInputValues } from '~/src/zodSchema/user-zod';
import { signUp } from '~/src/lib/auth-client';
import { Card } from 'primereact/card';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function SignUpUser() {
  const defaultAddressValues = {
    street: '',
    postCode: '',
  };

  const userDefaultValues = {
    displayName: '',
    firstName: '',
    familyName: '',
    email: '',
    password: '',
    confirmedPassword: '',
    // address: defaultAddressValues,
  };
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<userInputValues>({
    resolver: zodResolver(userInputSchema), // Integrate Zod for schema-based validation
    defaultValues: userDefaultValues,
    mode: 'onChange',
  });

  const footer = (
    <div className='flex justify-center w-full border-t py-4'>
      <p className='text-center text-xs text-neutral-500'>
        Secured by <span className='text-orange-400'>better-auth.</span>
      </p>
    </div>
  );
  const onUserSubmit = async (formData: userInputValues) => {
    // var { firstName, familyName, email, password } = formData;
    const { displayName, firstName, familyName, email, password } = formData;

    const res = await signUp.email({
      displayName,
      firstName,
      familyName,
      email,
      password,
      name: `${firstName} ${familyName}`,
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
          router.push('/secure');
        },
      },
    });
  };

  const getFormErrorMessage = (name: string) => {
    return (
      errors[name as keyof userInputValues] && (
        <small className='p-error'>
          {errors[name as keyof userInputValues]?.message}
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
      <form onSubmit={handleSubmit(onUserSubmit)}>
        <div className='formgrid grid'>
          {/* Display name line */}
          <div className='field col-12'>
            <Controller
              name='displayName'
              control={control}
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
                      width={'100%'}
                      value={field.value}
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

          {/* First and Family name line */}
          <div className='field col-6'>
            <Controller
              name='firstName'
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <label
                    htmlFor={field.name}
                    className={classNames({
                      'p-error': errors.firstName,
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
                    <label htmlFor={field.name}>First Name</label>
                  </span>

                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
          <div className='field col-6 '>
            <Controller
              name='familyName'
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <label
                    htmlFor={field.name}
                    className={classNames({
                      'p-error': errors.familyName,
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
                    <label htmlFor={field.name}>Family Name</label>
                  </span>

                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>

          {/* Email line */}
          <div className='field col-12 w-full '>
            <Controller
              name='email'
              control={control}
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

          {/* password line */}
          <div className='field col-6 '>
            <Controller
              name='password'
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <label
                    htmlFor={field.name}
                    className={classNames({
                      'p-error': errors.password,
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
                    <label htmlFor={field.name}>Password</label>
                  </span>

                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>

          <div className='field col-6 '>
            <Controller
              name='confirmedPassword'
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <label
                    htmlFor={field.name}
                    className={classNames({
                      'p-error': errors.confirmedPassword,
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
                    <label htmlFor={field.name}>Confirmed Password</label>
                  </span>

                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>

          <Button type='submit' disabled={loading} severity='secondary'>
            save user
          </Button>
        </div>
      </form>
    </Card>
  );
}
