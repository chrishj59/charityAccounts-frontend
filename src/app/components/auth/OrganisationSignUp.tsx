import {
  organisationCategoryEnum,
  organisationIdTypeEnum,
} from '~/app/constants/constants';
import { RationesOrganisation } from '~/types';
import { Address } from '~/types/user';
import { NextPage } from 'next';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Dispatch, SetStateAction, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

interface ChildProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}
interface DropdownListValues {
  status: string;
  value: number;
}

const OrganisationSignUpPage = ({ step, setStep }: ChildProps) => {
  const [defaultOrg, setDefaultOrg] = useState<RationesOrganisation>();

  const defaultUserAddress: Address = {
    houseNumber: defaultOrg?.address.houseNumber
      ? defaultOrg?.address.houseNumber
      : 0,
    postCode: defaultOrg?.address.postCode ? defaultOrg?.address.postCode : '',
  };
  const defaultOrgAddress: Address = {
    houseNumber: defaultOrg?.address.houseNumber
      ? defaultOrg?.address.houseNumber
      : 0,
    postCode: defaultOrg?.address.postCode ? defaultOrg?.address.postCode : '',
  };

  const defaultOrgValues: RationesOrganisation = {
    organisationCategory: defaultOrg?.organisationCategory
      ? defaultOrg?.organisationCategory
      : organisationCategoryEnum.Company,
    organisationIdType: defaultOrg?.organisationIdType
      ? defaultOrg?.organisationIdType
      : organisationIdTypeEnum.CompanyNum,
    organisationId: defaultOrg?.organisationId
      ? defaultOrg?.organisationId
      : '',
    displayName: '',
    address: defaultOrgAddress,
    created: false,
  };

  const orgCategory: DropdownListValues[] = [
    { status: 'Company', value: 0 },
    { status: 'Partnership', value: 1 },
    { status: 'Person', value: 2 },
  ];

  const orgIdType: DropdownListValues[] = [
    { status: 'Companies House Number', value: 0 },
    { status: 'Registered Charity number', value: 1 },
    { status: 'Tax UTR', value: 2 },
    { status: 'Trading Name', value: 3 },
  ];

  const selectedOrgTypeTemplate = (option: DropdownListValues, props: any) => {
    if (option) {
      return (
        <div className='flex align-items-center'>
          <div>{option.status}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const orgTypeOptionTemplate = (option: DropdownListValues) => {
    return (
      <div className='flex align-items-center'>
        <div className='mr-2'>Org Type:</div>
        <div>{option.status}</div>
      </div>
    );
  };

  const orgIdTypeOptionTemplate = (option: DropdownListValues) => {
    return (
      <div className='flex align-items-center'>
        <div className='mr-2'>Id Type:</div>
        <div>{option.status}</div>
      </div>
    );
  };

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    getValues,
  } = useForm<RationesOrganisation>({ defaultValues: defaultOrgValues });

  const getFormErrorMessage = (name: string) => {
    return (
      errors[name as keyof RationesOrganisation] && (
        <small className='p-error'>
          {errors[name as keyof RationesOrganisation]?.message}
        </small>
      )
    );
  };
  const onUserSubmit = async (formData: RationesOrganisation) => {
    alert(`submit called with ${JSON.stringify(formData)}`);
    setStep(step + 1);
  };

  return (
    <form onSubmit={handleSubmit(onUserSubmit)}>
      <div className='formgrid grid w-2/3'>
        {/* ** Display name line ** */}
        <div className='field col-12 '>
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
                    width={'w-screen'}
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

        {/* *** Organisation type and id row*** */}

        {/* ** Organsisation type ** */}
        <div className='field col-12 md:col-2'>
          <Controller
            name='organisationCategory'
            control={control}
            render={({ field, fieldState }) => (
              <>
                <label
                  htmlFor={field.name}
                  className={classNames({
                    'p-error': errors.organisationCategory,
                  })}
                ></label>
                <span className='p-float-label'>
                  <Dropdown
                    id={field.name}
                    value={field.value}
                    focusInputRef={field.ref}
                    onBlur={field.onBlur}
                    optionLabel='Organistion type'
                    options={orgCategory}
                    placeholder='Select the current type'
                    onChange={(e) => field.onChange(e.value)}
                    className={classNames({
                      'p-invalid': fieldState.error,
                    })}
                    valueTemplate={selectedOrgTypeTemplate}
                    itemTemplate={orgTypeOptionTemplate}
                  />
                  {getFormErrorMessage(field.name)}
                  <label htmlFor={field.name}>Org Category</label>
                </span>
              </>
            )}
          />
        </div>

        {/* ** Id  type ** */}
        <div className='field col-12 md:col-3'>
          <Controller
            name='organisationIdType'
            control={control}
            render={({ field, fieldState }) => (
              <>
                <label
                  htmlFor={field.name}
                  className={classNames({
                    'p-error': errors.organisationIdType,
                  })}
                ></label>
                <span className='p-float-label'>
                  <Dropdown
                    id={field.name}
                    value={field.value}
                    focusInputRef={field.ref}
                    onBlur={field.onBlur}
                    optionLabel='Id type'
                    options={orgIdType}
                    placeholder='Select the current type'
                    onChange={(e) => field.onChange(e.value)}
                    className={classNames({
                      'p-invalid': fieldState.error,
                    })}
                    valueTemplate={selectedOrgTypeTemplate}
                    itemTemplate={orgIdTypeOptionTemplate}
                  />
                  {getFormErrorMessage(field.name)}
                  <label htmlFor={field.name}>Id type</label>
                </span>
              </>
            )}
          />
        </div>
        {/* ** Id  type ** */}
        <div className='field col-12 md:col-7'>
          <Controller
            name='organisationId'
            control={control}
            render={({ field, fieldState }) => (
              <>
                <label
                  htmlFor={field.name}
                  className={classNames({
                    'p-error': errors.organisationIdType,
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
                  {getFormErrorMessage(field.name)}
                  <label htmlFor={field.name}>Id value</label>
                </span>
              </>
            )}
          />
        </div>
        {/* *** Address block *** */}
        {/* ** House number street line ** */}

        {/* House Number */}
        <div className='field col-12 md:col-4'>
          <Controller
            name='address.houseNumber'
            control={control}
            render={({ field, fieldState }) => (
              <>
                <label
                  htmlFor={field.name}
                  className={classNames({
                    'p-error': errors.organisationIdType,
                  })}
                ></label>
                <span className='p-float-label'>
                  <InputNumber
                    id={field.name}
                    value={field.value}
                    inputRef={field.ref}
                    onBlur={field.onBlur}
                    onValueChange={(e) => field.onChange(e)}
                    useGrouping={false}
                    disabled={false}
                    className={classNames({
                      'p-invalid': fieldState.error,
                    })}
                  />
                  {getFormErrorMessage(field.name)}
                  <label htmlFor={field.name}>House number</label>
                </span>
              </>
            )}
          />
        </div>

        {/* Street Name */}
        <div className='field col-12 md:col-8'>
          <Controller
            name='address.street'
            control={control}
            render={({ field, fieldState }) => (
              <>
                <label
                  htmlFor={field.name}
                  className={classNames({
                    'p-error': errors.organisationIdType,
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
                  {getFormErrorMessage(field.name)}
                  <label htmlFor={field.name}>Street name</label>
                </span>
              </>
            )}
          />
        </div>

        {/* ** Town line ** */}
        <div className='field col-12 md:col-12'>
          <Controller
            name='address.town'
            control={control}
            // rules={{
            //   required: 'Name is required.',
            // }}
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
                  <label htmlFor={field.name}>Town</label>
                </span>
                {getFormErrorMessage(field.name)}
              </>
            )}
          />
        </div>

        {/* ** County and post code line ** */}

        {/* * County * */}
        <div className='field col-12 md:col-4'>
          <Controller
            name='address.county'
            control={control}
            // rules={{
            //   required: 'Name is required.',
            // }}
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
                  <label htmlFor={field.name}>County</label>
                </span>
                {getFormErrorMessage(field.name)}
              </>
            )}
          />
        </div>

        {/* * Post Code * */}
        <div className='field col-12 md:col-8'>
          <Controller
            name='address.postCode'
            control={control}
            // rules={{
            //   required: 'Name is required.',
            // }}
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
                  <label htmlFor={field.name}>Post Code</label>
                </span>
                {getFormErrorMessage(field.name)}
              </>
            )}
          />
        </div>
      </div>
      <div className='flex  '>
        <div className='pr-4'>
          <Button type='submit'>Save Organistion</Button>
        </div>
        <Button>Cancel</Button>
      </div>
    </form>
  );
};

export default OrganisationSignUpPage;
