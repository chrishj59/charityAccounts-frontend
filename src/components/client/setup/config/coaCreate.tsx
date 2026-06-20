'use client';

import { useSession, useActiveOrganization } from '~/src/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useClientQueries } from '@zenstackhq/tanstack-query/react';
import { schema } from '~/zenstack/schema';
import { Controller, useForm } from 'react-hook-form';
import { CoaFormValues, coaSchema } from '~/src/zodSchema/coa-schema';
import { classNames } from 'primereact/utils/utils';
import { InputText } from 'primereact/inputtext/inputtext';
import { FiscalPeriodRule, FiscalPeriodRuleHeader } from '~/zenstack/models';
import { Dropdown } from 'primereact/dropdown/dropdown';
interface CoaProps {
  orgId: string;
  userId: string;
  fiscalPeriods: FiscalPeriodRule[];
}
export default function CoaCreateUI({
  userId,
  orgId,
  fiscalPeriods,
}: CoaProps) {
  const router = useRouter();
  const client = useClientQueries(schema);

  // Called from onHandleSubmit
  const createCoa = client.chartOfAccounts.useCreate({
    optimisticUpdate: true,
  });

  const emptyCoa = {
    id: 0,
    name: '    ',
    fiscalPeriodRuleId: 0,
    organizationId: '',
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
        <div className='mr-2'>Fiscal Rule:</div>
        <div>{option.title}</div>
      </div>
    );
  };
  const onSubmitAdd = async (data: CoaFormValues) => {};

  return (
    <Card
      title={
        <div className='flex justify-content-center align-items-center'>
          New Chart of accounts
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmitAdd)} className='p-fluid'></form>

      {/* name field */}
      <div className='field'>
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
                disabled
                optionLabel='fiscal rules'
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
              <label htmlFor={field.name}>Designated By</label>
            </span>
          </>
        )}
      />
    </Card>
  );
}
