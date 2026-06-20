'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card } from 'primereact/card';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useEffect, useRef, useState } from 'react';
import { redirect, RedirectType, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Toast, ToastMessage } from 'primereact/toast';

import { Dialog } from 'primereact/dialog';

import {
  orgInputSchema,
  orgInputValues,
} from '~/src/zodSchema/signupOrg-schema';
import { Dropdown } from 'primereact/dropdown';
import { createAuthClient } from 'better-auth/client';
import {
  client,
  organization,
  signUp,
  useSession,
} from '~/src/lib/auth-client';
import type { userInputValues } from '~/src/zodSchema/signupUser-schema';
import { signupPost } from '~/src/types/signup';
import { signUpUserOrgAction } from '~/src/actions/auth/signup-organisation';
import { statusEnum } from '~/src/types/helper';
import { getParameters } from '~/src/actions/defaults/parameters';

type Props = {
  user: userInputValues;
  setActiveTabAction: React.Dispatch<React.SetStateAction<number>>;
};

export function SignUpOrg({ user, setActiveTabAction }: Props) {
  const [loading, setLoading] = useState<boolean>(false);

  const [showErrDialog, setShowErrDialog] = useState<boolean>(false);
  const [errMsgHeader, setErrMsgHeader] = useState<string>('');
  const [errMsgBody, setErrMsgBody] = useState<string>('');
  const [userCreated, setUserCreated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [newOrgName, setNewOrgName] = useState<string>('');
  const [legalFormSelected, setLegalFormSelected] =
    useState<string>('SoleTrader');
  const [idTypeSelected, setIdTypeSelected] = useState<number>(1);
  const [planSelected, setPlanSelected] = useState<number>(1);
  const toast = useRef<Toast>(null);

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
    { id: 2, name: 'Standard', description: 'Standard' },
    { id: 3, name: 'Premium', description: 'Premium' },
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
    const loadParameters = async () => {
      const _adminEmail = await getParameters('CHARITATIS_ADMIN_EMAIL');
      if (_adminEmail && _adminEmail.length > 0) {
        setAdminEmail(_adminEmail[0].value);
      }
    };
    loadParameters();
  }, []);

  const showToast = (
    severity: ToastMessage['severity'],
    summary: string,
    detail: string,
    sticky: boolean,
  ) => {
    toast.current?.show({ severity, summary, detail, sticky });
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

  //   const res = await fetch(`/api/parameter/CHARITATIS_ADMIN_EMAIL`);
  //   if (!res.ok) {
  //     throw new Error('Failed to fetch posts');
  //   }
  //   return res.json();
  // }

  // const {
  //   data: adminEmailParam,
  //   isLoading,
  //   isError,
  //   error,
  // } = useQuery({
  //   queryKey: ['parameters'],
  //   queryFn: fetchParameters,
  // });

  const onOrgSubmit = async (formData: orgInputValues) => {
    setLoading(true);

    const result = await signUpUserOrgAction(
      user,
      formData,

      adminEmail,
    );

    if (result.status === statusEnum.ERROR) {
      setShowErrDialog(true);
      setErrMsgHeader('Error Creating user / organisation');
      setErrMsgBody(result.message);
    } else {
      showToast(
        'success',
        'Saved user and Organisation',
        `User ${result?.data?.user?.name}`,
        false,
      );
      redirect('/secure', RedirectType.replace);
    }

    setLoading(false);

    // const generatedSlug = formData.tradingName
    //   .trim()
    //   .toLowerCase()
    //   .replace(/\s+/g, '-');

    // const idType = formData.idType;
    // let taxRef: string = '';
    // let companyNumber: string = '';

    // let charityNumber: string = '';

    // switch (idType) {
    //   case 0:
    //     taxRef = formData.identification;
    //     break;
    //   case 1:
    //     companyNumber = formData.identification;
    //     break;
    //   case 2:
    //     charityNumber = formData.identification;
    //     break;
    // }

    // const { data: newOrg, error: newOrgErr } = await organization.create(
    //   {
    //     name: formData.tradingName,
    //     slug: generatedSlug, // required
    //     // logo: "https://example.com/logo.png",
    //     tradingName: formData.tradingName,
    //     legalForm: formData.legalForm,
    //     idType: identificationTypes[formData.idType].name,
    //     legalName: formData.legalName,
    //     identification: formData.identification,
    //     accountType: planTypes[formData.accountType].name,
    //     charityNumber,
    //     taxRef,
    //     companyNumber,
    //     userId,
    //     keepCurrentActiveOrganization: false,
    //   },
    //   {
    //     onResponse: () => {
    //       setNewOrgName(newOrg?.name ? newOrg?.name : '');
    //       setLoading(false);
    //     },
    //     onSuccess: () => {
    //       showToast(
    //         'success',
    //         'Saved',
    //         `Created Organization ${newOrg?.name}`,
    //         false,
    //       );
    //       setLoading(false);
    //     },
    //     onError: (error) => {
    //       setErrMsgHeader(`Could not create User ${newOrgErr?.statusText}`);
    //       setErrMsgBody(newOrgErr?.message ? newOrgErr.message : '');
    //       setShowErrDialog(true);
    //       return;
    //       // toast.error(error.error.message);
    //       setLoading(false);
    //     },
    //   },
    // );
    // if (!newOrgErr) {
    //   return;
    // }
    // const { data: newTeam, error: newTeamErr } =
    //   await client.organization.createTeam(
    //     {
    //       name: `${newOrg.name} default company`,
    //       organizationId: newOrg.id,
    //     },
    //     {
    //       onResponse: () => {
    //         showToast('success', 'Saved', `Created Team ${newTeam?.name}`);
    //         setLoading(false);
    //       },
    //       onSuccess: () => {
    //         showToast('success', 'Saved', `Created team ${newTeam?.name}`);
    //         setLoading(false);
    //       },
    //       onError: (error) => {
    //         setErrMsgHeader(
    //           `Could not create Team ${newTeamErr?.statusText}`,
    //         );
    //         setErrMsgBody(newTeamErr?.message ? newTeamErr.message : '');
    //         setShowErrDialog(true);
    //         return;
    //         // toast.error(error.error.message);
    //         setLoading(false);
    //       },
    //     },
    //   );
    // }
  };
  const errDialogHeader = (
    <span className='font-bold white-space-nowrap'>{errMsgHeader}</span>
  );

  const errDialogFooter = (
    <div className='flex justify-content-center'>
      <Button
        label='Close'
        icon='pi pi-times'
        outlined
        onClick={() => setShowErrDialog(false)}
      />
    </div>
  );
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
      <Dialog
        visible={showErrDialog}
        onHide={() => {
          if (!showErrDialog) return;
          setShowErrDialog(false);
        }}
        modal
        header={errDialogHeader}
        footer={errDialogFooter}
        closable
      >
        <p className='m-0 font-bold text-primary'>{errMsgBody}</p>
      </Dialog>
    </>
  );
}
