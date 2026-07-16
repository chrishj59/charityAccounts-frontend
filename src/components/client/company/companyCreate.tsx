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
  ISO3166Country,
} from '~/zenstack/models';

import { CoaType } from '~/src/types/ui-types/coa';
import { Dialog } from 'primereact/dialog';
import {
  AddressFormValues,
  addressSchema,
} from '~/src/zodSchema/address-schema';
import { AddressUI } from '~/src/types/ui-types/address';
import { InputNumber } from 'primereact/inputnumber';
import { ISO3166CountryUI } from '~/src/types/ui-types/country';

interface NewCompanyProps {
  fiscRuleList: FiscalPeriodRuleUI[];
  countries: ISO3166CountryUI[];
  coaList: CoaType[];
  userId: string;
  orgUI: OrganisationUI;
}
export default function NewCompanyUI({
  fiscRuleList,
  coaList,
  orgUI,
  countries,
  userId,
}: NewCompanyProps) {
  const client = useClientQueries(schema);
  const createCompany = client.company.useCreate({
    optimisticUpdate: true,
  });

  const createAddress = client.address.useCreate({ optimisticUpdate: true });
  const [hasValidAddress, setHasValidAddress] = useState<boolean>(false);

  const [addressLine, setAddressLine] = useState<string>('');
  const [addressDlg, setAddressDlg] = useState<boolean>(false);
  const [countryList, setCountryList] = useState<ISO3166CountryUI[]>(countries);
  const [coaSet, setCoaSet] = useState<CoaType[]>(coaList);
  const toast = useRef<Toast | null>(null);

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

  const getUkCountryId = (name: string): number => {
    const gb = countries.find((c) => {
      return c.name === name;
    });

    return gb?.id ?? 0;
  };

  const emptyCompany: CompanyUI = {
    tradingName: '',
    legalName: '',
    ref: '',
    legalForm: toOrgLegalForm(orgUI.legalForm), // ✓ always OrgLegalForm
    // legalType: organisationCategoryEnum.Company,
    idtype: toIdTypeForm(orgUI.idType),

    identification: '', // fiscYear: '',

    // charityNumber: '',
    // fiscalPeriodRuleId: 0,
    vatRegNumber: '',
    // organizationId: '',
    chartOfAccountsId: 0,
    // companyGroupId: 0,
    registeredCountryId: getUkCountryId(
      'United Kingdom of Great Britain and Northern Ireland',
    ),
    // registeredOfficeAddressId: 0,
    // addressLine: '',
  };

  const emptyAddress: AddressUI = {
    id: 0,
    buildingCode: '',

    room: '',
    careOf: '',
    street: '',
    street2: '',
    street3: '',

    houseNumber: 0,
    houseName: '',
    town: '',
    county: '',
    postCode: '',
    isoCountryId: getUkCountryId(
      'United Kingdom of Great Britain and Northern Ireland',
    ),
  };
  const [address, setAddress] = useState<AddressUI>(emptyAddress);
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
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  // useEffect(() => {
  //   setValues(
  //     {
  //       chartOfAccountsId: coaSet[0].id,
  //       // registeredCountryId: getUkCountryId(
  //       //   'United Kingdom of Great Britain and Northern Ireland',
  //       // ),
  //     },
  //     { shouldValidate: true, shouldDirty: true, shouldTouch: true },
  //   );
  // }, []);

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

  const DialogFooter = () => (
    <div className='flex flex-row space-x-10'>
      <div>
        <Button type='submit' severity='success'>
          Add Address
        </Button>
      </div>
      <div className='ml-2'>
        <Button type='reset' severity='danger' onClick={() => resetAddress()}>
          Reset
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

  const selectedCountryStatusTemplate = (
    option: ISO3166CountryUI,
    props: any,
  ) => {
    if (option) {
      return (
        <div className='flex align-items-center'>
          <div>{option.name}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const countryOptionTemplate = (option: ISO3166CountryUI) => {
    return (
      <div className='flex align-items-center'>
        {/* <div className='mr-2'>Fiscal Rule:</div> */}
        <div>{option.name}</div>
      </div>
    );
  };

  const onSubmitCompany = async (data: companyNewFormValues) => {
    try {
      //createCompany

      const selectedCoa = coaList.find((c) => c.id === data.chartOfAccountsId);
      let updatedCompany;
      if (selectedCoa) {
        let companyData;
        if (hasValidAddress) {
          let registeredOfficeAddressId: number | undefined;

          if (address) {
            const createdAddress = await createAddress.mutateAsync({
              data: {
                houseNumber: address.houseNumber ?? 0,
                houseName: address.houseName ?? '',
                street: address.street ?? '',
                county: address.county ?? '',
                postCode: address.postCode ?? '',
                isoCountryId: address.isoCountryId ?? 0,
                createdById: userId,
                organizationId: orgUI.id,
              },
            });
            registeredOfficeAddressId = createdAddress.id;
          }
          companyData = {
            companyCode: data.ref,
            tradingName: data.tradingName,
            // legalForm: data.legalForm,
            companyName: data.legalName,

            chartOfAccountsId: data.chartOfAccountsId,
            registeredCountryId: data.registeredCountryId,
            createdById: userId,
            organizationId: orgUI.id,
            fiscalPeriodRuleId: selectedCoa?.fiscalPeriodRuleId ?? 0,
            ...(registeredOfficeAddressId !== undefined && {
              registeredOfficeAddressId,
            }),
          };

          updatedCompany = await createCompany.mutateAsync({
            data: companyData,
          });
        } else {
          companyData = {
            companyCode: data.ref,
            tradingName: data.tradingName,
            // legalForm: data.legalForm,
            companyName: data.legalName,

            chartOfAccountsId: data.chartOfAccountsId,
            registeredCountryId: data.registeredCountryId,
            createdById: userId,
            organizationId: orgUI.id,
            fiscalPeriodRuleId: selectedCoa?.fiscalPeriodRuleId ?? 0,
          };

          updatedCompany = await createCompany.mutateAsync({
            data: companyData,
          });
        }

        setValues(data);
        showToast(
          'success',
          'Company Created',
          `Created company with trading name ${JSON.stringify(updatedCompany.tradingName)}`,
          false,
        );
      } else {
        showToast(
          'error',
          'No chart of accounts',
          `Please select a chart of accounts`,
          false,
        );
      }
    } catch (err) {
      showToast(
        'error',
        'Could  not save Company',
        `Error ${JSON.stringify(err, null, 2)}`,
        true,
      );
    }
  };

  const onSubmitAddress = async (addressData: AddressFormValues) => {
    const _address: AddressUI = {
      houseNumber: addressData.houseNumber,
      houseName: addressData.houseName,

      street: addressData.street,
      town: addressData.town,
      county: addressData.county,
      postCode: addressData.postCode,
      isoCountryId: addressData.isoCountryId,
    };
    let _addrline: string = '';
    if (addressData.houseName) {
      _addrline.concat(addressData.houseName, addressData.street);
    } else if (addressData.houseNumber) {
      _addrline.concat(addressData.houseNumber.toString(), addressData.street);
    }

    setAddressLine(_addrline);
    setAddress(_address);
    setHasValidAddress(true);
    setAddressDlg(false);
  };

  const onClickcopyFromOrg = () => {
    const _legalForm = orgUI.legalForm;

    setValues(
      {
        legalForm: 'Company',
        tradingName: orgUI.tradingName ?? '',
        legalName: orgUI.legalName ?? '',
        registeredCountryId: getUkCountryId(
          'United Kingdom of Great Britain and Northern Ireland',
        ),
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
        <form
          onSubmit={handleSubmit(onSubmitCompany, (errors) =>
            console.warn('RHF errors:', errors),
          )}
          className='p-fluid'
        >
          <Card
            pt={{
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

              <div className='field col-6'>
                {/* Address display */}

                <div className='flex flex-row align-items-end gap-2'>
                  <div className='flex-1'>
                    <label htmlFor='addressLine'>Address Line</label>
                    <InputText id='addressLine' disabled>
                      {addressLine}
                    </InputText>
                  </div>

                  <div>
                    <Button onClick={() => setAddressDlg(true)} type='button'>
                      Add address
                    </Button>
                  </div>
                </div>
              </div>

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
                          options={coaSet}
                          optionLabel='name'
                          optionValue='id'
                          placeholder='Chart of accounts'
                          onChange={(e) => {
                            field.onChange(e.value);
                          }}
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

              <div className='field col-6'>
                <Controller
                  name='registeredCountryId'
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className={classNames({
                          'p-error': errors.registeredCountryId,
                        })}
                      ></label>
                      <span className='p-float-label'>
                        <Dropdown
                          id={field.name}
                          value={field.value}
                          focusInputRef={field.ref}
                          onBlur={field.onBlur}
                          options={countryList}
                          optionLabel='name'
                          optionValue='id'
                          placeholder='Company Country'
                          emptyMessage='No available countries'
                          onChange={(e) => field.onChange(e.value)}
                          className={classNames({
                            'p-invalid': fieldState.error,
                          })}
                          valueTemplate={selectedCountryStatusTemplate}
                          itemTemplate={countryOptionTemplate}
                        />
                        {getFormErrorMessage(field.name)}
                        <label htmlFor={field.name}>Country</label>
                      </span>
                    </>
                  )}
                />
              </div>

              {/* fiscal period rule
              <div className='field col-6'>
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
                          options={fiscRuleList}
                          optionLabel='title'
                          optionValue='id'
                          placeholder='Fiscal Period rule'
                          emptyMessage='No period rules'
                          onChange={(e) => field.onChange(e.value)}
                          className={classNames({
                            'p-invalid': fieldState.error,
                          })}
                          valueTemplate={selectedFiscalPeriodStatusTemplate}
                          itemTemplate={fiscalRuleOptionTemplate}
                        />
                        {getFormErrorMessage(field.name)}
                        <label htmlFor={field.name}>Fiscal Period rule</label>
                      </span>
                    </>
                  )}
                />
              </div> */}
            </div>
          </Card>
        </form>

        <Dialog
          visible={addressDlg}
          style={{ width: '50vw' }}
          breakpoints={{ '960px': '75vw', '641px': '90vw' }}
          header='Add Registered Address'
          modal
          className='p-fluid'
          onHide={onHideAddressDlg}
          // footer={DialogFooter}
          pt={{
            headerTitle: {
              className: 'flex items-center justify-center ',
            },
          }}
        >
          <form
            onSubmit={handleSubmitAddress(onSubmitAddress, (errors) =>
              console.warn('RHF errors:', errors),
            )}
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

            {/* Post code*/}
            <div className='field col-7'>
              <Controller
                name='postCode'
                control={controlAddress}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className={classNames({
                        'p-error': errorsAddess.postCode,
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
                      <label htmlFor={field.name}>Post Code</label>
                    </span>
                    {getFormErrorMessageAddress(field.name)}
                  </>
                )}
              />
            </div>

            {/* country */}
            <div className='field col-6'>
              <Controller
                name='isoCountryId'
                control={controlAddress}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className={classNames({
                        'p-error': errorsAddess.isoCountryId,
                      })}
                    ></label>
                    <span className='p-float-label'>
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        focusInputRef={field.ref}
                        onBlur={field.onBlur}
                        options={countryList}
                        optionLabel='name'
                        optionValue='id'
                        placeholder='Country'
                        emptyMessage='No available countries'
                        onChange={(e) => field.onChange(e.value)}
                        className={classNames({
                          'p-invalid': fieldState.error,
                        })}
                        valueTemplate={selectedCountryStatusTemplate}
                        itemTemplate={countryOptionTemplate}
                      />
                      {getFormErrorMessage(field.name)}
                      <label htmlFor={field.name}>Country</label>
                    </span>
                  </>
                )}
              />
            </div>

            {DialogFooter()}
          </form>
        </Dialog>
      </div>
    </div>
  );
}
