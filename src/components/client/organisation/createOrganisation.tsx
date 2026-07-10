'use client';

import { Card } from 'primereact/card';
import { Toast, ToastMessage } from 'primereact/toast';
import { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  orgInputSchema,
  orgInputValues,
} from '~/src/zodSchema/signupOrg-schema';
import { statusEnum } from '~/src/types/helper';

import {
  //orgCreateAction,
  signUpUserOrgAction,
} from '~/src/actions/auth/signup-organisation';

import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { orgCreateAction } from '~/src/actions/auth/organisationCreate';

type Props = {
  userId: string;
};
export default function TradingOrgCreatePage({ userId }: Props) {
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showErrDialog, setShowErrDialog] = useState<boolean>(false);
  const [errMsgHeader, setErrMsgHeader] = useState<string>('');
  const [errMsgBody, setErrMsgBody] = useState<string>('');
  const [legalFormSelected, setLegalFormSelected] =
    useState<string>('SoleTrader');
  const [idTypeSelected, setIdTypeSelected] = useState<number>(1);
  const [planSelected, setPlanSelected] = useState<number>(1);

  const orgDefaultValues = {
    tradingName: '',
    identification: '',
    legalName: '',
  };
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

  const showToast = (
    severity: ToastMessage['severity'],
    summary: string,
    detail: string,
    sticky: boolean,
  ) => {
    toast.current?.show({ severity, summary, detail, sticky });
  };
  const onOrgSubmit = async (formData: orgInputValues) => {
    setLoading(true);

    const result = await orgCreateAction(formData, userId);

    if (result.status !== statusEnum.SUCCESS) {
      setShowErrDialog(true);
      setErrMsgHeader('Error Creatingorganisation');
      setErrMsgBody(`Could not create Organsiation ${formData.tradingName}`);
    } else {
      showToast(
        'success',
        'Saved Organisation',
        `Trading name ${formData.tradingName}`,
        false,
      );
    }

    setLoading(false);
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
        pt={{
          title: {
            className: 'flex justify-content-center align-items-center',
          },
        }}
        className='z-50 rounded-md rounded-t-none '
        title='Create organisation'
        //subTitle='Enter your information to create your organisation'
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
          setLoading(false);
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
