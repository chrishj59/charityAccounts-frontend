'use client';

import { Card } from 'primereact/card';
import { FiscalPeriodRuleUI } from '~/src/types/ui-types/fiscal-period';
import { useClientQueries } from '@zenstackhq/tanstack-query/react';
import { schema } from '~/zenstack/schema';
import { useRef } from 'react';
import { Toast, ToastMessage } from 'primereact/toast';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CompanyGroupFormValues,
  companyGroupSchema,
} from '~/src/zodSchema/company-group.schema';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
interface NewCompanyGroupProps {
  userId: string;
  orgId: string;
  fiscRuleList: FiscalPeriodRuleUI[];
}
export default function NewCompanyGroupUI({
  userId,
  orgId,
  fiscRuleList,
}: NewCompanyGroupProps) {
  const client = useClientQueries(schema);
  const createGroup = client.companyGroup.useCreate({
    optimisticUpdate: true,
  });

  const toast = useRef<Toast | null>(null);

  const emptyCompanyGroup = {
    id: 0,
    name: '',
    fiscRuleId: 0,
    createdAt: new Date(),
    createdById: '',
    organizationId: '',
  };

  const {
    control,
    trigger,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<CompanyGroupFormValues>({
    resolver: zodResolver(companyGroupSchema),
    defaultValues: emptyCompanyGroup,
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
      errors[name as keyof CompanyGroupFormValues] && (
        <small className='p-error'>
          {errors[name as keyof CompanyGroupFormValues]?.message}
        </small>
      )
    );
  };

  const onSubmitAdd = async (data: CompanyGroupFormValues) => {
    const _groupCompValues = {
      name: data.name,
      createdAt: new Date(),
      fiscalPeriodRuleId: data.fiscalRuleId ?? 0,
      createdById: userId,
      organizationId: orgId,
    };

    try {
      const newCompGroup = await createGroup.mutateAsync({
        data: _groupCompValues,
      });
      console.log('toast ref at call time:', toast.current);
      showToast(
        'success',
        'Created Group Company',
        `Created Group Company ${newCompGroup.name}`,
        false,
      );
    } catch (err) {
      showToast(
        'error',
        'Could not save Group Company',
        `Error ${JSON.stringify(err, null, 2)} Please check your entry and retry. If the issue persists please message support`,
        true,
      );
    }
  };

  const CardFooter = () => (
    <div className='flex flex-row space-x-10'>
      <div>
        <Button type='submit' severity='success'>
          Save Group Company
        </Button>
      </div>
      <div className='ml-2'>
        <Button type='reset' severity='danger' onClick={() => reset()}>
          Reset Group Company
        </Button>
      </div>
    </div>
  );

  const selectedFiscalPeriodStatusTemplate = (
    option: FiscalPeriodRuleUI,
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

  const fiscalRuleOptionTemplate = (option: FiscalPeriodRuleUI) => {
    return (
      <div className='flex align-items-center'>
        {/* <div className='mr-2'>Fiscal Rule:</div> */}
        <div>{option.title}</div>
      </div>
    );
  };

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
            title='New Group Company'
            className='z-50 rounded-md rounded-t-none '
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
                  name='fiscalRuleId'
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className={classNames({
                          'p-error': errors.fiscalRuleId,
                        })}
                      ></label>
                      <span className='p-float-label'>
                        <Dropdown
                          id={field.name}
                          value={field.value}
                          focusInputRef={field.ref}
                          onBlur={field.onBlur}
                          options={fiscRuleList}
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
    // <Card
    //   title={
    //     <div className='flex justify-content-center align-items-center'>
    //       Create Group Company
    //     </div>
    //   }
    // ></Card>
  );
}
