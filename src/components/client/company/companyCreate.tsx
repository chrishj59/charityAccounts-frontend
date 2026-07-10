'use client';

import { FiscalPeriodRuleUI } from '~/src/types/ui-types/fiscal-period';
import { useActiveOrganization, useSession } from '~/src/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { useClientQueries } from '@zenstackhq/tanstack-query/react';
import { schema } from '~/zenstack/schema';
import { useEffect, useRef, useState } from 'react';
import { Toast, ToastMessage } from 'primereact/toast';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'primereact/button';
import { CompanyUI } from '~/src/types/ui-types/company';

import {
  companyNewFormValues,
  companyNewSchema,
} from '~/src/zodSchema/company-new-schema';
import {
  ID_TYPE_FORM_OPTIONS,
  ORG_LEGAL_FORM_OPTIONS,
  organisationCategoryEnum,
} from '~/src/app/constants/constants';
import { OrganisationUI } from '~/src/types/ui-types/organisation';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import {
  OrgLegalForm,
  OrgIdentificationType,
  Address,
} from '~/zenstack/models';

import { CoaType } from '~/src/types/ui-types/coa';
import { Dialog } from 'primereact/dialog';
import {
  AddressFormValues,
  addressSchema,
} from '~/src/zodSchema/address-schema';
import { AddressUI } from '~/src/types/ui-types/address';
import { InputNumber } from 'primereact/inputnumber';

interface NewCompanyProps {
  fiscRuleList: FiscalPeriodRuleUI[];
  coaList: CoaType[];
  userId: string;
  orgUI: OrganisationUI;
}
export default function NewCompanyUI({
  fiscRuleList,
  coaList,
  orgUI,
  userId,
}: NewCompanyProps) {
  console.log(
    `NewCompanyUI  called with ${JSON.stringify(fiscRuleList, null, 2)} and org ${JSON.stringify(orgUI, null, 2)}`,
  );

  const client = useClientQueries(schema);
  const createCompany = client.company.useCreate({
    optimisticUpdate: true,
  });

  const [addressLine, setAddressLine] = useState<string | undefined>(undefined);
  const [addressDlg, setAddressDlg] = useState<boolean>(false);
  const toast = useRef<Toast | null>(null);

  const session = useSession();
  console.log(`session ${JSON.stringify(session.data, null, 2)}`);
  const showToast = (
    severity: ToastMessage['severity'],
    summary: string,
    detail: string,
    sticky: boolean,
  ) => {
    toast.current?.show({ severity, summary, detail, sticky });
  };

  // Type guard / cast helper
  function toOrgLegalForm(value: string | null | undefined): OrgLegalForm {
    if (value && Object.values(OrgLegalForm).includes(value as OrgLegalForm)) {
      return value as OrgLegalForm;
    }
    return OrgLegalForm.SoleTrader; // safe default
  }

  function toIdTypeForm(
    value: string | null | undefined,
  ): OrgIdentificationType {
    if (
      value &&
      Object.values(OrgIdentificationType).includes(
        value as OrgIdentificationType,
      )
    ) {
      return value as OrgIdentificationType;
    }
    return OrgIdentificationType.Company_Number; // safe default
  }

  const emptyCompany: CompanyUI = {
    id: 0,
    ref: '',
    tradingName: '',
    legalName: '',
    legalForm: toOrgLegalForm(orgUI.legalForm), // ✓ always OrgLegalForm
    legalType: organisationCategoryEnum.Company,
    idtype: toIdTypeForm(orgUI.idType),
    fiscYear: '',
    identification: '',
    charityNumber: '',
    fiscalPeriodRuleId: 0,
    vatNumber: '',
    organizationId: '',
    chartOfAccountsId: 0,
    companyGroupId: 0,
    registeredOfficeAddressId: 0,
    addressLine: '',
  };

  const emptyAddress: AddressUI = {
    addressID: 0,
    street: '',

    postCode: '',
  };

  const {
    control,
    trigger,
    formState: { errors },
    handleSubmit,
    reset,
    setValues,
  } = useForm<companyNewFormValues>({
    resolver: zodResolver(companyNewSchema),
    defaultValues: emptyCompany,
  });

  const {
    control: controlAddress,
    trigger: triggerAddress,
    formState: { errors: errorsAddess },
    handleSubmit: handleSubmitAddress,
    reset: resetAddress,
    setValues: setValuesAddress,
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: emptyAddress,
  });

  const CardFooter = () => (
    <div className='flex flex-row space-x-10'>
      <div>
        <Button type='submit' severity='success'>
          Save Company
        </Button>
      </div>
      <div className='ml-2'>
        <Button type='reset' severity='danger' onClick={() => reset()}>
          Reset Company
        </Button>
      </div>
    </div>
  );

  const getFormErrorMessage = (name: string) => {
    return (
      errors[name as keyof companyNewFormValues] && (
        <small className='p-error'>
          {errors[name as keyof companyNewFormValues]?.message}
        </small>
      )
    );
  };

  const getFormErrorMessageAddress = (name: string) => {
    return (
      errorsAddess[name as keyof AddressFormValues] && (
        <small className='p-error'>
          {errorsAddess[name as keyof AddressFormValues]?.message}
        </small>
      )
    );
  };

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

  const selectedCoaStatusTemplate = (option: CoaType, props: any) => {
    if (option) {
      return (
        <div className='flex align-items-center'>
          <div>{option.name}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const coaOptionTemplate = (option: CoaType) => {
    return (
      <div className='flex align-items-center'>
        {/* <div className='mr-2'>Fiscal Rule:</div> */}
        <div>{option.name}</div>
      </div>
    );
  };
  const onSubmitAdd = async (data: companyNewFormValues) => {
    alert(`onSubmitAdd called with`);
    setValues(data);
  };

  const onSubmitAddress = async (addressData: AddressFormValues) => {
    alert(
      `onSubmitAddress called with ${JSON.stringify(addressData, null, 2)}`,
    );
  };

  const onClickcopyFromOrg = () => {
    console.log(
      `onClickcopyFromOrg called Org passed in ${JSON.stringify(orgUI, null, 2)} `,
    );
    setValues(
      {
        tradingName: orgUI.tradingName ?? '',
        legalName: orgUI.legalName ?? '',
      },
      {
        shouldValidate: true, // re-runs zod resolver on changed fields
        shouldDirty: true, // marks fields as dirty (enables submit button if you check isDirty)
        shouldTouch: true, // marks fields as touched (shows validation errors)
      },
    );
  };

  const onHideAddressDlg = () => {
    //TODO: check values correct
    setAddressDlg(false);
  };

  return (
    <div className='flex justify-content-center align-items-center'>
      <Toast ref={toast} position='top-right' />
      <div className='flex '>
        <form onSubmit={handleSubmit(onSubmitAdd)} className='p-fluid'>
          <Card
            pt={{
              // root: {
              //   className: 'w-full md:w-full',
              // },
              title: {
                className:
                  'flex justify-content-center align-items-center text-primary',
              },
            }}
            title='Add Company'
            className='z-50 rounded-md rounded-t-none '
            footer={CardFooter}
          >
            <div>
              <Button
                type='button'
                className='w-64'
                onClick={onClickcopyFromOrg}
              >
                {' '}
                Copy from Organisation{' '}
              </Button>
            </div>

            <div className='formgrid grid mt-4'>
              {/* Legal form block and ref row */}

              {/* Legal form dropdown */}
              <div className='field col-6'>
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
                      ></label>
                      <span className='p-float-label'>
                        <Dropdown
                          id={field.name}
                          value={field.value}
                          focusInputRef={field.ref}
                          onBlur={field.onBlur}
                          options={ORG_LEGAL_FORM_OPTIONS}
                          optionLabel='label'
                          optionValue='value'
                          placeholder='Select legal form'
                          onChange={(e) => field.onChange(e.value)}
                          className={classNames({
                            'p-invalid': fieldState.error,
                          })}
                        />
                        {getFormErrorMessage(field.name)}
                        <label htmlFor={field.name}>Legal Form</label>
                      </span>
                    </>
                  )}
                />
              </div>

              {/* company ref field */}
              <div className='field col-6'>
                <Controller
                  name='ref'
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className={classNames({
                          'p-error': errors.ref,
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
                        <label htmlFor={field.name}>Company Reference</label>
                      </span>
                      {getFormErrorMessage(field.name)}
                    </>
                  )}
                />
              </div>

              {/* Name row */}

              {/* Trading name field */}
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
                        <label htmlFor={field.name}>Trading name</label>
                      </span>
                      {getFormErrorMessage(field.name)}
                    </>
                  )}
                />
              </div>

              {/* Legal name field */}
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
                        <label htmlFor={field.name}>Legal name</label>
                      </span>
                      {getFormErrorMessage(field.name)}
                    </>
                  )}
                />
              </div>

              {/* Address and Vat number row */}

              {/* Address */}
              <div className='field col-6'>
                {/* Address display */}
                <div className='flex flex-row align-items-end gap-2'>
                  <div className='flex-1'>
                    <label htmlFor='addressLine'>Address Line</label>
                    <InputText id='addressLine' disabled>
                      {addressLine}
                    </InputText>
                  </div>
                  {/* Address button */}
                  <div>
                    <Button onClick={() => setAddressDlg(true)} type='button'>
                      Add address
                    </Button>
                  </div>
                </div>
              </div>

              {/* VAT number */}
              <div className='field col-6'>
                <Controller
                  name='vatRegNumber'
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className={classNames({
                          'p-error': errors.vatRegNumber,
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
                        <label htmlFor={field.name}>VAT registration </label>
                      </span>
                      {getFormErrorMessage(field.name)}
                    </>
                  )}
                />
              </div>

              {/* Identification row */}

              {/* Identification type dropdown */}
              <div className='field col-6'>
                <Controller
                  name='idtype'
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className={classNames({
                          'p-error': errors.idtype,
                        })}
                      ></label>
                      <span className='p-float-label'>
                        <Dropdown
                          id={field.name}
                          value={field.value}
                          focusInputRef={field.ref}
                          onBlur={field.onBlur}
                          options={ID_TYPE_FORM_OPTIONS}
                          optionLabel='label'
                          optionValue='value'
                          placeholder='Select identification type'
                          onChange={(e) => field.onChange(e.value)}
                          className={classNames({
                            'p-invalid': fieldState.error,
                          })}
                        />
                        {getFormErrorMessageAddress(field.name)}
                        <label htmlFor={field.name}>Indentification type</label>
                      </span>
                    </>
                  )}
                />
              </div>

              {/* Indentification value */}
              <div className='field col-6'>
                <Controller
                  name='identification'
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className={classNames({
                          'p-error': errors.identification,
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
                        <label htmlFor={field.name}>Identification</label>
                      </span>
                      {getFormErrorMessage(field.name)}
                    </>
                  )}
                />
              </div>

              {/* Period rule and chart of accounts line */}

              {/* Chart of Accounts */}
              <div className='field col-6'>
                <Controller
                  name='chartOfAccountsId'
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className={classNames({
                          'p-error': errors.chartOfAccountsId,
                        })}
                      ></label>
                      <span className='p-float-label'>
                        <Dropdown
                          id={field.name}
                          value={field.value}
                          focusInputRef={field.ref}
                          onBlur={field.onBlur}
                          options={coaList}
                          optionLabel='name'
                          optionValue='id'
                          placeholder='Chart of'
                          onChange={(e) => field.onChange(e.value)}
                          className={classNames({
                            'p-invalid': fieldState.error,
                          })}
                          valueTemplate={selectedCoaStatusTemplate}
                          itemTemplate={coaOptionTemplate}
                        />
                        {getFormErrorMessage(field.name)}
                        <label htmlFor={field.name}>Chart of accounts</label>
                      </span>
                    </>
                  )}
                />
              </div>
            </div>
          </Card>
          <Dialog
            visible={addressDlg}
            style={{ width: '50vw' }}
            breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            header='Add Registered Address'
            modal
            className='p-fluid'
            onHide={onHideAddressDlg}
            pt={{
              headerTitle: {
                className: 'flex items-center justify-center ',
              },
            }}
          >
            <form
              onSubmit={handleSubmitAddress(onSubmitAddress)}
              className='p-fluid'
            >
              <div className='formgrid grid mt-4'>
                {/* Street block */}
                {/* House Name / Number */}
                {/* house Number */}
                <div className='field col-2'>
                  <Controller
                    name='houseNumber'
                    control={controlAddress}
                    render={({ field, fieldState }) => (
                      <>
                        <label
                          htmlFor={field.name}
                          className={classNames({
                            'p-error': errorsAddess.houseNumber,
                          })}
                        />
                        <span className='p-float-label'>
                          <InputNumber
                            id={field.name}
                            value={field.value}
                            // disabled={watchedCalendarBased}
                            autoFocus
                            onChange={(e) => field.onChange(e.value)}
                            className={classNames({
                              'p-invalid': fieldState.error,
                            })}
                          />
                          <label htmlFor={field.name}>Number</label>
                        </span>
                        {getFormErrorMessageAddress(field.name)}
                      </>
                    )}
                  />
                </div>
                {/*end house number */}
                {/* house name */}
                <div className='field col-5'>
                  <Controller
                    name='houseName'
                    control={controlAddress}
                    render={({ field, fieldState }) => (
                      <>
                        <label
                          htmlFor={field.name}
                          className={classNames({
                            'p-error': errorsAddess.houseName,
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
                          <label htmlFor={field.name}>House Name</label>
                        </span>
                        {getFormErrorMessageAddress(field.name)}
                      </>
                    )}
                  />
                </div>{' '}
                {/*End house name */}
              </div>

              {/* Street  */}
              <div className='field col-7'>
                <Controller
                  name='street'
                  control={controlAddress}
                  render={({ field, fieldState }) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className={classNames({
                          'p-error': errorsAddess.street,
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
                        <label htmlFor={field.name}>Street</label>
                      </span>
                      {getFormErrorMessageAddress(field.name)}
                    </>
                  )}
                />
              </div>

              {/* Town */}
              <div className='field col-7'>
                <Controller
                  name='town'
                  control={controlAddress}
                  render={({ field, fieldState }) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className={classNames({
                          'p-error': errorsAddess.town,
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
                        <label htmlFor={field.name}>Town</label>
                      </span>
                      {getFormErrorMessageAddress(field.name)}
                    </>
                  )}
                />
              </div>

              {/* County */}
              <div className='field col-7'>
                <Controller
                  name='county'
                  control={controlAddress}
                  render={({ field, fieldState }) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className={classNames({
                          'p-error': errorsAddess.county,
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
                        <label htmlFor={field.name}>County</label>
                      </span>
                      {getFormErrorMessageAddress(field.name)}
                    </>
                  )}
                />
              </div>
            </form>
          </Dialog>
        </form>
      </div>
    </div>
  );
}
