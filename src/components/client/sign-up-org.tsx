'use client';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card } from 'primereact/card';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Toast, ToastMessage } from 'primereact/toast';

import { Dialog } from 'primereact/dialog';

import {
  orgInputSchema,
  orgInputValues,
} from '~/src/zodSchema/signupOrg-schema';
import { Dropdown } from 'primereact/dropdown';
import { createAuthClient } from 'better-auth/client';
import { organization, useSession } from '~/src/lib/auth-client';

export function SignUpOrg() {
  const [loading, setLoading] = useState<boolean>(false);

  const [legalFormSelected, setLegalFormSelected] =
    useState<string>('SoleTrader');
  const [idTypeSelected, setIdTypeSelected] = useState<number>(1);
  const [planSelected, setPlanSelected] = useState<number>(1);
  const toast = useRef<Toast>(null);

  const userId = useSession.get().data?.user.id;
  const orgDefaultValues = {
    tradingName: '',
    identification: '',
    legalName: '',
  };
  const legalForms = [
    { id: 'SoleTrader', name: 'Sole  sTrader', description: 'Sole Trader' },
    { id: 'Company', name: 'Company', description: 'Company' },
    { id: 'Partnership', name: 'Partnership', description: 'Partnership' },
  ];

  const identificationTypes = [
    { id: 0, name: 'UTR_tax_ref', description: 'UTR tax ref' },
    { id: 1, name: 'Company_Number', description: 'Company Number' },
    { id: 2, name: 'Charity_number', description: 'Charity Number' },
  ];

  const planTypes = [
    { id: 0, name: 'Trial', description: 'Trial' },
    { id: 1, name: 'Free', description: 'Free' },
    { id: 2, name: 'Premium', description: 'Premium' },
  ];

  const {
    setValue,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<orgInputValues>({
    resolver: zodResolver(orgInputSchema), // Integrate Zod for schema-based validation
    defaultValues: orgDefaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    setValue('legalForm', 'SoleTrader');
    setValue('idType', 0);
    setValue('accountType', 0);
  }, []);

  const showToast = (
    severity: ToastMessage['severity'],
    summary: string,
    detail: string,
  ) => {
    toast.current?.show({ severity, summary, detail });
  };

  const handleLegalFormChange = (e: { value: string }) => {
    setValue('legalForm', e.value);
    setLegalFormSelected(e.value);
  };

  const handleIdentificationTypeChange = (e: { value: number }) => {
    setValue('idType', e.value);
    setIdTypeSelected(e.value);
  };
  const handlePlanChange = (e: { value: number }) => {
    setValue('accountType', e.value);
    setPlanSelected(e.value);
  };

  const getFormErrorMessage = (name: string) => {
    return (
      errors[name as keyof orgInputValues] && (
        <small className='p-error'>
          {errors[name as keyof orgInputValues]?.message}
        </small>
      )
    );
  };
  const onOrgSubmit = async (formData: orgInputValues) => {
    setLoading(true);
    const generatedSlug = formData.tradingName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');

    const idType = formData.idType;
    let taxRef: string = '';
    let companyNumber: string = '';

    let charityNumber: string = '';

    switch (idType) {
      case 0:
        taxRef = formData.identification;
        break;
      case 1:
        companyNumber = formData.identification;
        break;
      case 2:
        charityNumber = formData.identification;
        break;
    }

    const { data, error } = await organization.create(
      {
        name: formData.tradingName,
        slug: generatedSlug, // required
        // logo: "https://example.com/logo.png",
        tradingName: formData.tradingName,
        legalForm: formData.legalForm,
        idType: identificationTypes[formData.idType].name,
        legalName: formData.legalName,
        identification: formData.identification,
        accountType: planTypes[formData.accountType].name,
        charityNumber,
        taxRef,
        companyNumber,
        userId,
        keepCurrentActiveOrganization: false,
      },
      {
        onResponse: () => {
          setLoading(false);
        },
        onSuccess: () => {
          showToast('success', 'Saved', 'Organization created successfully');
          setLoading(false);
          // toast.success(
          //     'Organization created successfully'
          // );
        },
        onError: (error) => {
          showToast('error', 'Failed to save organsation', error.error.message);
          // toast.error(error.error.message);
          setLoading(false);
        },
      },
    );
  };

  return (
    <>
      <Toast ref={toast} position='center' />
      <Card
        className='z-50 rounded-md rounded-t-none '
        title='Create organisation'
        subTitle='Enter your information to create your organisation'
        // footer={footer}
      >
        <form onSubmit={handleSubmit(onOrgSubmit)}>
          <div className='formgrid grid'>
            {/* Name line */}

            <div className='field col-6'>
              <Controller
                name='tradingName'
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className={classNames({
                        'p-error': errors.tradingName,
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
                      <label htmlFor={field.name}>Trading Name</label>
                    </span>
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>
            <div className='field col-6'>
              <Controller
                name='legalName'
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className={classNames({
                        'p-error': errors.legalName,
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
                      <label htmlFor={field.name}>Legal Name</label>
                    </span>
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>

            {/* Legal form */}
            <div className='field col-12'>
              <Controller
                name='legalForm'
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className={classNames({
                        'p-error': errors.legalForm,
                      })}
                    />
                    <span className='p-float-label'>
                      <Dropdown
                        id={field.name}
                        onChange={handleLegalFormChange}
                        placeholder='Select legal type of the organisation'
                        value={legalFormSelected}
                        options={legalForms}
                        optionValue='id'
                        optionLabel='description'
                        className={classNames({
                          'p-invalid': fieldState.error,
                        })}
                      />
                      <label htmlFor={field.name}>Legal Form</label>
                    </span>
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>

            {/* Identidication row */}
            <div className='field col-6'>
              <Controller
                name='idType'
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className={classNames({
                        'p-error': errors.legalForm,
                      })}
                    />
                    <span className='p-float-label'>
                      <Dropdown
                        id={field.name}
                        onChange={handleIdentificationTypeChange}
                        options={identificationTypes}
                        placeholder='Select Identification type'
                        value={idTypeSelected}
                        optionValue='id'
                        optionLabel='description'
                        className={classNames({
                          'p-invalid': fieldState.error,
                        })}
                      />
                      <label htmlFor={field.name}>Identification type</label>
                    </span>

                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>
            <div className='field col-6'>
              <Controller
                name='identification'
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className={classNames({
                        'p-error': errors.tradingName,
                      })}
                    ></label>
                    <span className='p-float-label'>
                      <InputText
                        id={field.name}
                        value={field.value}
                        className={classNames({
                          'p-invalid': fieldState.error,
                        })}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      <label htmlFor={field.name}>Identity value</label>
                    </span>
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>

            {/* Account type row */}
            <div className='field col-12'>
              <Controller
                name='accountType'
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className={classNames({
                        'p-error': errors.accountType,
                      })}
                    ></label>
                    <span className='p-float-label'>
                      <Dropdown
                        id={field.name}
                        onChange={handlePlanChange}
                        options={planTypes}
                        value={planSelected}
                        optionValue='id'
                        optionLabel='name'
                        className={classNames({
                          'p-invalid': fieldState.error,
                        })}
                      />
                      <label htmlFor={field.name}>Account Type</label>
                    </span>
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>

            <Button type='submit' disabled={loading} severity='success'>
              Save organisation
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
