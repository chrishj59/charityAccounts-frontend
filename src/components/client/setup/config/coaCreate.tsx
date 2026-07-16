'use client';

import { useSession, useActiveOrganization } from '~/src/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useClientQueries } from '@zenstackhq/tanstack-query/react';
import { schema } from '~/zenstack/schema';
import { Controller, useForm } from 'react-hook-form';
import { CoaFormValues, coaSchema } from '~/src/zodSchema/coa-schema';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { FiscalPeriodRule, FiscalPeriodRuleHeader } from '~/zenstack/models';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast, ToastMessage } from 'primereact/toast';
import { useRef } from 'react';
interface CoaProps {
  orgId: string;
  userId: string;
  fiscalPeriods: FiscalPeriodRuleHeader[];
}
export default function CoaCreateUI({
  userId,
  orgId,
  fiscalPeriods,
}: CoaProps) {
  const router = useRouter();
  const client = useClientQueries(schema);
  const toast = useRef<Toast | null>(null);

  // Called from onHandleSubmit
  const createCoa = client.chartOfAccounts.useCreate({
    optimisticUpdate: true,
  });

  const emptyCoa: CoaFormValues = {
    id: 0,
    name: '',
    fiscalPeriodRuleId: null,
    organizationId: '',
    createdById: '',
  };

  const {
    control,
    trigger,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<CoaFormValues>({
    resolver: zodResolver(coaSchema),
    defaultValues: emptyCoa,
  });

  const showToast = (
    severity: ToastMessage['severity'],
    summary: string,
    detail: string,
    sticky: boolean,
  ) => {
    toast.current?.show({ severity, summary, detail, sticky });
  };

  const getFormErrorMessage = (name: string) => {
    return (
      errors[name as keyof CoaFormValues] && (
        <small className='p-error'>
          {errors[name as keyof CoaFormValues]?.message}
        </small>
      )
    );
  };

  const selectedFiscalPeriodStatusTemplate = (
    option: FiscalPeriodRuleHeader,
    props: any,
  ) => {
    if (option) {
      return (
        <div className='flex align-items-center'>
          <div>{option.title}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const fiscalRuleOptionTemplate = (option: FiscalPeriodRuleHeader) => {
    return (
      <div className='flex align-items-center'>
        {/* <div className='mr-2'>Fiscal Rule:</div> */}
        <div>{option.title}</div>
      </div>
    );
  };

  const onSubmitAdd = async (data: CoaFormValues) => {
    const _coaValues = {
      name: data.name,
      createdAt: new Date(),
      fiscalPeriodRuleId: data.fiscalPeriodRuleId ?? 0,
      createdById: userId,
      organizationId: orgId,
    };

    try {
      const newCoa = await createCoa.mutateAsync({ data: _coaValues });
      console.log('toast ref at call time:', toast.current);
      showToast(
        'success',
        'Created Chart of Accounts',
        `Created Coa ${newCoa.name}`,
        false,
      );
    } catch (err) {
      showToast(
        'error',
        'Could not save Chart',
        'Please check your entry and retry. If the issue persists please message support',
        true,
      );
    }
  };

  const CardFooter = () => (
    <div className='flex flex-row space-x-10'>
      <div>
        <Button type='submit' severity='success'>
          Save Chart of Accounts
        </Button>
      </div>
      <div className='ml-2'>
        <Button type='reset' severity='danger' onClick={() => reset()}>
          Reset Chart of accounts
        </Button>
      </div>
    </div>
  );

  return (
    <div className='flex justify-content-center align-items-center'>
      <Toast ref={toast} position='top-right' />
      <div className='flex w-1/2 '>
        <form onSubmit={handleSubmit(onSubmitAdd)} className='p-fluid'>
          <Card
            pt={{
              root: {
                className: 'w-200 md:w-full',
              },
              title: {
                className:
                  'flex justify-content-center align-items-center text-primary',
              },
            }}
            title='New Chart of Accounts'
            className='z-50 rounded-md rounded-t-none '
            // {
            // <div className='flex justify-content-center align-items-center text-primary'>

            // </div>
            // }
            footer={CardFooter}
          >
            <div className='formgrid grid'>
              {/* name field */}
              <div className='field col-12'>
                <Controller
                  name='name'
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className={classNames({
                          'p-error': errors.name,
                        })}
                      />
                      <span className='p-float-label'>
                        <InputText
                          id={field.name}
                          value={field.value}
                          // disabled={watchedCalendarBased}
                          autoFocus
                          onChange={(e) => field.onChange(e.target.value)}
                          className={classNames({
                            'p-invalid': fieldState.error,
                          })}
                        />
                        <label htmlFor={field.name}>name</label>
                      </span>
                      {getFormErrorMessage(field.name)}
                    </>
                  )}
                />
              </div>

              {/* Period rule  */}
              <div className='field '>
                <Controller
                  name='fiscalPeriodRuleId'
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className={classNames({
                          'p-error': errors.fiscalPeriodRuleId,
                        })}
                      ></label>
                      <span className='p-float-label'>
                        <Dropdown
                          id={field.name}
                          value={field.value}
                          focusInputRef={field.ref}
                          onBlur={field.onBlur}
                          options={fiscalPeriods}
                          optionLabel='title'
                          optionValue='id'
                          placeholder='Fiscal Periods'
                          onChange={(e) => field.onChange(e.value)}
                          className={classNames({
                            'p-invalid': fieldState.error,
                          })}
                          valueTemplate={selectedFiscalPeriodStatusTemplate}
                          itemTemplate={fiscalRuleOptionTemplate}
                        />
                        {getFormErrorMessage(field.name)}
                        <label htmlFor={field.name}>Fiscal Period Rule</label>
                      </span>
                    </>
                  )}
                />
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}
