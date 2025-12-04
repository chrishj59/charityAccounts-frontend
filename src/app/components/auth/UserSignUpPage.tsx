import { saluationEnum } from '~/src/app/constants/constants';
import { RationesUser } from '~/src/types';
import { Dispatcher } from '~/src/types/helper';
import { Address } from '~/src/types/user';
import { NextPage } from 'next';
import { Button } from 'primereact/button';
import { InputNumberProps } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Dispatch, SetStateAction, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface ChildProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}
const UserSignUpPage = ({ step, setStep }: ChildProps) => {
  const [defaultUser, setDefaultUser] = useState<RationesUser>();

  const defaultUserAddress: Address = {
    houseNumber: defaultUser?.address.houseNumber
      ? defaultUser?.address.houseNumber
      : 0,
    postCode: defaultUser?.address.postCode
      ? defaultUser?.address.postCode
      : '',
  };

  const defaultUserValues: RationesUser = {
    displayName: defaultUser?.displayName ? defaultUser?.displayName : '',
    saluation: defaultUser?.saluation
      ? defaultUser?.saluation
      : saluationEnum.Mr,
    firstName: defaultUser?.firstName ? defaultUser?.firstName : '',
    familyName: defaultUser?.familyName ? defaultUser?.familyName : '',
    organisationName: defaultUser?.organisationName
      ? defaultUser?.organisationName
      : '',
    organistionId: defaultUser?.organistionId ? defaultUser?.organistionId : '',
    address: defaultUserAddress,
    // houseNumber: defaultUser?.houseNumber ? defaultUser?.houseNumber : 0,
    // street: defaultUser?.street ? defaultUser?.street : '',
    // town: defaultUser?.town ? defaultUser?.town : '',
    // county: defaultUser?.county ? defaultUser?.county : '',
    // postCode: defaultUser?.postCode ? defaultUser?.postCode : '',
    created: false,
    loggedin: false,
  };

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    getValues,
  } = useForm<RationesUser>({ defaultValues: defaultUserValues });

  const getFormErrorMessage = (name: string) => {
    return (
      errors[name as keyof RationesUser] && (
        <small className='p-error'>
          {errors[name as keyof RationesUser]?.message}
        </small>
      )
    );
  };

  const onUserSubmit = async (formData: RationesUser) => {
    setStep(step + 1);
  };
  // if (1 === 1) {
  //   return <div>UserSignUpPage called before return</div>;
  // }

  return (
    <form onSubmit={handleSubmit(onUserSubmit)}>
      {/* <div className='flex justify-content-center p-fluid  '> */}
      {/* <Card title='Contact Information'> */}
      {/* display Name line */}
      {/* <div className='formgrid grid'>
            <div className='field col-12 '> */}
      <div className='formgrid grid'>
        {/* ** Display name row ** */}
        <div className='field col-12 w-full'>
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
                    width={'100%'}
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
        {/* </div>
          </div> */}

        {/* first Name line */}

        <div className='field col-12'>
          <Controller
            name='firstName'
            control={control}
            rules={{
              required: 'First Name is required.',
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
                    width={'100%'}
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
      </div>
      <div>
        <div className='flex justify-content-center flex-wrap'>
          <div className='flex align-items-center justify-content-center'>
            <Button type='submit'>Save User</Button>
          </div>
        </div>
      </div>
      {/* </div>
          </div> */}
      {/* </Card> */}
      {/* </div> */}
    </form>
  );
};

export default UserSignUpPage;
