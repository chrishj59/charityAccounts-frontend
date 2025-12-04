'use client';

import { NextPage } from 'next';

import { RationesOrganisation, RationesUser } from '~/src/types';

import { JSX, useState } from 'react';

import UserSignUpPage from '~/src/app/components/auth/UserSignUpPage';
import { Steps } from 'primereact/steps';
import OrganisationSignUpPage from './OrganisationSignUp';

const SignUpPage: NextPage = () => {
  let activeTab = 0;
  const [step, setStep] = useState<number>(0);

  // const defaultOrganisationValues: RationesOrganisation = {
  //   organisationCaterory: organisationCategoryType.Company,
  //   organisationIdType: organisationIdType.CompanyNum,
  //   organisationId: '',
  //   created: false,
  // };

  /** User submit button */

  /** Organisation submit */
  const onOrgSubmit = async (formdata: RationesOrganisation) => {};

  // const organisationEntry = (): JSX.Element => {
  //   return (
  //     <form onSubmit={handleSubmit(onUserSubmit)}>
  //       <div className='field'>
  //         {/* <Controller
  // 							name="country"
  // 							control={control}
  // 							render={({ field, fieldState }) => (
  // 								<>
  // 									<label
  // 										htmlFor={field.name}
  // 										className={classNames({
  // 											'p-error': errors.country,
  // 										})}
  // 									/>
  // 									<span className="p-float-label">
  // 										<Dropdown
  // 											id={field.name}
  // 											onChange={handleCountryChange}
  // 											defaultValue={232}
  // 											value={countryEntered}
  // 											optionValue="id"
  // 											optionLabel="name"
  // 											options={props.countries}
  // 											className={classNames({
  // 												'p-invalid': fieldState.error,
  // 											})}
  // 										/>
  // 										<label htmlFor={field.name}>Country</label>
  // 									</span>
  // 									{getFormErrorMessage(field.name)}
  // 								</>
  // 							)}
  // 						/> */}
  //       </div>
  //     </form>
  //   );
  // };
  const stepsItems = [
    {
      label: 'Organisation details',
    },
    {
      label: 'User account details',
    },
  ];

  const stepsBody = () => {
    switch (step) {
      case 0:
        return <OrganisationSignUpPage step={step} setStep={setStep} />;

      case 1:
        return <UserSignUpPage step={step} setStep={setStep} />;
    }
  };
  return (
    <>
      {/* <div className='card'> */}
      <Steps
        model={stepsItems}
        activeIndex={step}
        pt={{
          root: { className: 'w-30rem' },
        }}
      />
      {stepsBody()}
      {/* </div> */}
    </>
  );
};

export default SignUpPage;
