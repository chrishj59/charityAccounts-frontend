'use client';

import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Toast, ToastMessage } from 'primereact/toast';
import { JSX, useEffect, useRef, useState } from 'react';
import { fundSelectInterface } from '~/src/interface/fundSelect.interface';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { Controller, useForm } from 'react-hook-form';
import {
  FundNewFormValues,
  fundNewSchema,
} from '~/src/zodSchema/fund-new-schema';

import {
  fundUpdateAction,
  getFundById,
} from '~/src/actions/company/fund/masterdata';
import { isFundUI, responseType, statusEnum } from '~/src/types/helper';
import { classNames } from 'primereact/utils';
import { FormEvent } from 'primereact/ts-helpers';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FloatLabel } from 'primereact/floatlabel';
import { Calendar } from 'primereact/calendar';

import {
  FundUI,
  FundTypeEnum,
  DesignatedFundUI,
} from '~/src/types/ui-types/fund'; //'../../../types/ui-types/fund';
import { useClientQueries } from '@zenstackhq/tanstack-query/react';
import { schema } from '~/zenstack/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { getGbpFormatter } from '~/src/lib/Intl/numberFormatter';
import { getShortDateFormatter } from '~/src/lib/Intl/dateFormatter';
import { ISOCountryCheckedCreateInput } from '../../../../zenstack/input';

import {
  FundEditFormValues,
  fundEditSchema,
} from '~/src/zodSchema/fund-edit-schema';
import { UserUI } from '~/src/types/ui-types/user';
import { userInputValues } from '~/src/zodSchema/signupUser-schema';

interface FundListProps {
  userId: string;
  orgId: string;
  selectList: fundSelectInterface[];
  userList: UserUI[];
}

export default function EditFund({
  userId,
  orgId,
  selectList,
  userList,
}: FundListProps) {
  const client = useClientQueries(schema);
  const toast = useRef<Toast>(null);
  const router = useRouter();
  const stepperRef = useRef<Stepper>(null);
  const defaultSelectedFund: fundSelectInterface = { id: '', name: '' };
  const fundDefaultValues = {
    name: '',
    donar: '',
    returnSurplus: false,
    designatedMeeting: '',
    objective: '',
    fundType: 'General',
  };
  // selected item from the dropdown (id + name only)
  const [selectedFund, setSelectedFund] = useState<fundSelectInterface | null>(
    null,
  );
  const [selectedDesignatedBy, setSelecteDesignatedBy] =
    useState<UserUI | null>(null);
  const [selectedDesignationCreatedBy, setSelectedDesignationCreatedBy] =
    useState<UserUI | null>(null);
  const [selectedDesignationReleasedBy, setSelectedDesignationReleasedBy] =
    useState<UserUI | null>(null);
  // const [selectedFund, setSelectedFund] =
  //   useState<fundSelectInterface>(defaultSelectedFund);

  // const [currentFund, setCurrentFund] = useState<FundUI>();

  // full fund data loaded from DB
  const [currentFund, setCurrentFund] = useState<FundUI | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [canSave, setCanSave] = useState<boolean>(false);
  const [reviewDate, setReviewDate] = useState<Date>(new Date());
  const [projectEndDate, setProjectEndDate] = useState<Date>(new Date());
  const [nextDonarReviewDate, setNextDonarReviewDate] = useState<Date>(
    new Date(),
  );
  const [designatedDate, setDesignatedDate] = useState<Date>(new Date());
  const [returnSurplus, setReturnSurplus] = useState<boolean>(false);
  const fundTypes = [
    {
      id: 'General',
      name: 'General Fund',
      description: 'General Fund - unrestricted',
    },
    {
      id: 'Designated',
      name: 'Designated',
      description: 'Restricted - Designated Fund ',
    },
    { id: 'Income', name: 'Income', description: 'Restricted - Income' },
    {
      id: 'Expendable',
      name: 'Expendable',
      description: 'Restricted - Expendable Endownment',
    },
    {
      id: 'Permanent',
      name: 'Permanent',
      description: 'Restricted - Permanent Endownment',
    },
  ];
  const gbpFormatter = getGbpFormatter();
  const shortDateFormatter = getShortDateFormatter();

  const currDate = new Date();
  const getFormErrorMessage = (name: string) => {
    return (
      errors[name as keyof FundEditFormValues] && (
        <small className='p-error'>
          {errors[name as keyof FundEditFormValues]?.message}
        </small>
      )
    );
  };
  const showToast = (
    severity: ToastMessage['severity'],
    summary: string,
    detail: string,
    sticky: boolean,
    life: number,
  ) => {
    toast.current?.show({ severity, summary, detail, sticky });
  };
  const {
    reset,
    setValue,
    getValues,
    trigger,
    handleSubmit,

    formState: { errors, isDirty },
    control,
  } = useForm<FundEditFormValues>({
    resolver: zodResolver(fundEditSchema), // Integrate Zod for schema-based validation
    defaultValues: fundDefaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const {
    data: fundData,
    isSuccess,
    isLoading,
  } = client.fund.useFindUnique({
    where: { id: selectedFund?.id ?? '' },
  });

  const isDesignated = fundData?.type === 'DesignatedFund';
  const {
    data: designatedFundData,
    isSuccess: designatedSuccess,
    isLoading: designatedIsLoading,
  } = client.designatedFund.useFindUnique({
    where: { id: isDesignated ? (selectedFund?.id ?? '') : '' },
    include: {
      createdBy: true,
      organization: true,
      // ZenStack v3 chained delegate — nest through each level
      // RestrictedFund: {
      //   include: {
      //     DesignatedFund: {
      //       include: {
      //         designationCreatedBy: true,
      //         designationReleasedBy: true,
      //         designatedBy: true,
      //         currency: true,
      //         balances: true,
      //       },
      //     },
      //   },
      // },
    },
  });

  const fundLoaded = isSuccess && !!fundData;
  const designatedLoaded = designatedSuccess && !!designatedFundData;

  useEffect(() => {
    if (!fundData) return;
    const _fundType = fundData.fundType;
    const fundUI: FundUI = {
      id: fundData.id,
      fundName: fundData.fundName,
      objective: fundData.objective ?? '',
      fundType: fundData.fundType,
      reviewDate: fundData.reviewDate,
      // ...map remaining fields
    };
    switch (_fundType) {
      case 'Designated':
        const designatedUI: DesignatedFundUI = {
          designatedBal: fundData.designatedBal,
          curcyCode: fundData.curcyCode,
          currentBal: fundData.currentBal,
          designatedDate: fundData.designatedDate,
          releasedDate: fundData.releasedDate,
          designatedMeeting: fundData.designatedMeeting
            ? fundData.designatedMeeting
            : '',
          undesignateMeeting: fundData.undesignateMeeting
            ? fundData.undesignateMeeting
            : '',
          designatedById: fundData.designatedById,
          designationReleasedById: fundData.designationReleasedById,
        };
        fundUI.designatedFund = designatedUI;
        break;
    }

    setCurrentFund(fundUI);

    reset({
      id: fundData.id,
      name: fundData.fundName,
      objective: fundData.objective ?? '',
      fundType: fundData.fundType,
      designatedMeeting: fundData.designatedMeeting,
      designatedDate: fundData.designatedDate,
      undesignateMeeting: fundData.undesignateMeeting
        ? fundData.undesignateMeeting
        : '',
      designatedById: fundData.designatedById,
      designationReleasedById: fundData.designationReleasedById,
    });
  }, [fundData]);

  const onFundChange = (e: { value: fundSelectInterface }) => {
    setSelectedFund(e.value); // { id, name } — triggers useFindFirst
    setValue('id', e.value.id);
  };

  const handleObjectiveChange = async (e: string) => {
    setValue('objective', e);

    const valid = await trigger(['name', 'objective']);
    if (valid) {
      setCanSave(true);
    }
  };
  const onReviewDateChange = (e: Date) => {
    const value = e;

    (setReviewDate(value), setValue('reviewDate', value));
  };

  const getNextStepperStep = () => {
    stepperRef.current?.nextCallback();
  };

  const getPreviousStepperStep = () => {
    stepperRef.current?.prevCallback();
  };
  const selectedUserStatusTemplate = (option: UserUI, props: any) => {
    if (option) {
      return (
        <div className='flex align-items-center'>
          <div>{option.name}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const userStatusOptionTemplate = (option: UserUI) => {
    return (
      <div className='flex align-items-center'>
        <div className='mr-2'>User:</div>
        <div>{option.name}</div>
      </div>
    );
  };
  const renderFundBasic = (): JSX.Element => {
    return (
      <div className='flex flex-column '>
        <div className='border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-left align-items-center font-medium'>
          <div className='formgrid grid'>
            {/* Name line */}
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
                      <label htmlFor={field.name}>Fund Name</label>
                    </span>
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>

            {/* Objective */}
            <div className='field col-12'>
              <Controller
                name='objective'
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className={classNames({
                        'p-error': errors.name,
                      })}
                    ></label>
                    <span className='p-float-label'>
                      <InputTextarea
                        id={field.name}
                        value={field.value}
                        rows={5}
                        cols={40}
                        onChange={(
                          e: React.ChangeEvent<HTMLTextAreaElement>,
                        ) => {
                          field.onChange(e.target.value);
                          handleObjectiveChange(e.target.value);
                        }}
                        //onChange={(e) => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.error,
                        })}
                      />
                      <label htmlFor={field.name}>Fund Objective</label>
                    </span>
                    {getFormErrorMessage(field.name)}
                  </>
                )}
              />
            </div>

            {/* Review date */}
            <div className='field col-12'>
              <FloatLabel>
                <Calendar
                  id='reviewDate'
                  dateFormat='dd/M/yy'
                  value={reviewDate}
                  minDate={new Date()}
                  onChange={(
                    e: FormEvent<Date, React.SyntheticEvent<Element, Event>>,
                  ) => onReviewDateChange(e.value ? e.value : currDate)}
                  showIcon
                />
                <label htmlFor='reviewDate'>Progress Review Date</label>
              </FloatLabel>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderFundDetail = (): JSX.Element => {
    const _currenFund = currentFund;

    if (!_currenFund) {
      return <div>no fund found</div>;
    }
    const validFund = Object.values(FundTypeEnum).includes(
      _currenFund.fundType,
    );
    if (!validFund) {
      return <div> Invalid fund type</div>;
    }

    switch (_currenFund.fundType) {
      case 'General':
        const generalFundBal = gbpFormatter.format(
          _currenFund.generalFund?.balance
            ? _currenFund.generalFund?.balance
            : 0,
        );
        return (
          <div className='flex justify-center '>
            <div className='grid grid-cols-2 gap-4'>
              <div className='font-medium'>Balance:</div>
              <div className='font-medium'>{generalFundBal}</div>
            </div>
          </div>
        );

      case 'Designated':
        const designatedDate = _currenFund.designatedFund?.designatedDate
          ? _currenFund.designatedFund?.designatedDate
          : new Date();
        const releasedDate = _currenFund.designatedFund?.releasedDate;

        return (
          <>
            <div className='flex flex-column '>
              <div className='border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-left align-items-center font-medium'>
                <div className='formgrid grid align-items-end'>
                  {/***  Designated meeting row ***/}
                  <div className='field col-4'>
                    <Controller
                      name='designatedMeeting'
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <label
                            htmlFor={field.name}
                            className={classNames({
                              'p-error': errors.name,
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
                            <label htmlFor={field.name}>
                              Designation Meeting
                            </label>
                          </span>
                          {getFormErrorMessage(field.name)}
                        </>
                      )}
                    />
                  </div>

                  <div className='field col-4'>
                    <FloatLabel>
                      <Calendar
                        id='designatedDate'
                        dateFormat='dd/M/yy'
                        value={designatedDate}
                        onChange={(
                          e: FormEvent<
                            Date,
                            React.SyntheticEvent<Element, Event>
                          >,
                        ) => onReviewDateChange(e.value ? e.value : currDate)}
                        showIcon
                      />
                      <label htmlFor='designatedDate'>Designated Date</label>
                    </FloatLabel>
                  </div>

                  <div className='field col-4'>
                    <Controller
                      name='designatedById'
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <label
                            htmlFor={field.name}
                            className={classNames({
                              'p-error': errors.designatedById,
                            })}
                          ></label>
                          <span className='p-float-label'>
                            <Dropdown
                              id={field.name}
                              value={field.value}
                              focusInputRef={field.ref}
                              onBlur={field.onBlur}
                              options={userList}
                              disabled
                              optionLabel='displayName'
                              optionValue='id'
                              placeholder='Designated by'
                              onChange={(e) => field.onChange(e.value)}
                              className={classNames({
                                'p-invalid': fieldState.error,
                              })}
                              valueTemplate={selectedUserStatusTemplate}
                              itemTemplate={userStatusOptionTemplate}
                            />
                            {getFormErrorMessage(field.name)}
                            <label htmlFor={field.name}>Designated By</label>
                          </span>
                        </>
                      )}
                    />
                  </div>

                  {/***  Undesignated meeting row ***/}
                  <div className='field col-4'>
                    <Controller
                      name='undesignateMeeting'
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <label
                            htmlFor={field.name}
                            className={classNames({
                              'p-error': errors.name,
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
                            <label htmlFor={field.name}>
                              Designation Meeting
                            </label>
                          </span>
                          {getFormErrorMessage(field.name)}
                        </>
                      )}
                    />
                  </div>

                  <div className='field col-4'>
                    <FloatLabel>
                      <Calendar
                        id='releasedDate'
                        dateFormat='dd/M/yy'
                        value={releasedDate}
                        onChange={(
                          e: FormEvent<
                            Date,
                            React.SyntheticEvent<Element, Event>
                          >,
                        ) => onReviewDateChange(e.value ? e.value : currDate)}
                        showIcon
                      />
                      <label htmlFor='releasedDate'>Released Date</label>
                    </FloatLabel>
                  </div>

                  <div className='field col-4'>
                    <Controller
                      name='designationReleasedById'
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <label
                            htmlFor={field.name}
                            className={classNames({
                              'p-error': errors.designatedById,
                            })}
                          ></label>
                          <span className='p-float-label'>
                            <Dropdown
                              id={field.name}
                              value={field.value}
                              focusInputRef={field.ref}
                              onBlur={field.onBlur}
                              options={userList}
                              optionLabel='displayName'
                              optionValue='id'
                              placeholder='Released by'
                              onChange={(e) => field.onChange(e.value)}
                              className={classNames({
                                'p-invalid': fieldState.error,
                              })}
                              valueTemplate={selectedUserStatusTemplate}
                              itemTemplate={userStatusOptionTemplate}
                            />
                            {getFormErrorMessage(field.name)}
                            <label htmlFor={field.name}>Designated By</label>
                          </span>
                        </>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'Income':
        const incomeFundBalStr = gbpFormatter.format(
          _currenFund.incomeFund?.balance ? _currenFund.incomeFund?.balance : 0,
        );
        return (
          <div className='flex justify-center '>
            <div className='grid grid-cols-2 gap-4'>
              <div className='font-medium'>Balance:</div>
              <div className='font-medium'>{incomeFundBalStr}</div>
            </div>
          </div>
        );
      case 'Expendable':
        const expendInitCapStr = gbpFormatter.format(
          _currenFund.endownmentExpendable?.initalCapital
            ? _currenFund.endownmentExpendable?.initalCapital
            : 0,
        );
        const expendCapBalStr = gbpFormatter.format(
          _currenFund.endownmentExpendable?.capitalBalance
            ? _currenFund.endownmentExpendable?.capitalBalance
            : 0,
        );
        const expendIncEarnedStr = gbpFormatter.format(
          _currenFund.endownmentExpendable?.incomeEarned
            ? _currenFund.endownmentExpendable?.incomeEarned
            : 0,
        );
        const expendIncBalStr = gbpFormatter.format(
          _currenFund.endownmentExpendable?.incomeBalance
            ? _currenFund.endownmentExpendable?.incomeBalance
            : 0,
        );

        return (
          <div className='flex flex-col gap-4'>
            {/* Row 1 */}
            <div className='grid grid-cols-4 gap-4'>
              <div className='font-medium w-[8rem]'>Initial Capital:</div>
              <div className='font-medium'>{expendInitCapStr}</div>
              <div className='font-medium'>Initial Capital:</div>
              <div className='font-medium'>{expendCapBalStr}</div>
            </div>

            {/* Row 2 */}
            <div className='grid grid-cols-4 gap-4'>
              <div className='font-medium'>Income Earned:</div>
              <div className='font-medium'>{expendIncEarnedStr}</div>
              <div className='font-medium'>Initial Balance:</div>
              <div className='font-medium'>{expendIncBalStr}</div>
            </div>
          </div>
        );

      case 'Permanent':
        const permInitCapStr = gbpFormatter.format(
          _currenFund.endownmentPermanent?.initalCapital
            ? _currenFund.endownmentPermanent?.initalCapital
            : 0,
        );
        const permCapBalStr = gbpFormatter.format(
          _currenFund.endownmentPermanent?.capitalBalance
            ? _currenFund.endownmentPermanent?.capitalBalance
            : 0,
        );
        const permIncEarnedStr = gbpFormatter.format(
          _currenFund.endownmentPermanent?.incomeEarned
            ? _currenFund.endownmentPermanent.incomeEarned
            : 0,
        );
        const permIncBalStr = gbpFormatter.format(
          _currenFund.endownmentPermanent?.incomeBalance
            ? _currenFund.endownmentPermanent?.incomeBalance
            : 0,
        );

        return (
          <div className='flex flex-col gap-4'>
            {/* Row 1 */}
            <div className='grid grid-cols-4 gap-4'>
              <div className='font-medium w-[8rem]'>Initial Capital:</div>
              <div className='font-medium'>{permInitCapStr}</div>
              <div className='font-medium'>Initial Capital:</div>
              <div className='font-medium'>{permCapBalStr}</div>
            </div>

            {/* Row 2 */}
            <div className='grid grid-cols-4 gap-4'>
              <div className='font-medium'>Income Earned:</div>
              <div className='font-medium'>{permIncEarnedStr}</div>
              <div className='font-medium'>Initial Balance:</div>
              <div className='font-medium'>{permIncBalStr}</div>
            </div>
          </div>
        );

      default:
        console.error(`Should not be here. Please contact support}.`);
    }

    return <div> fund detail</div>;
  };

  const onFundSubmit = async (formData: FundEditFormValues) => {
    setLoading(true);
    const fundType = formData.fundType;

    try {
      const resp = await fundUpdateAction(formData, userId, orgId);

      if (resp.status === statusEnum.SUCCESS) {
        // reset();
        //    /funds/masterdata/create');
        showToast(
          'success',
          resp.message,
          `Fund name ${formData.name} Objective ${formData.objective}`,
          false,
          3000,
        );
        setTimeout(() => {
          reset();
          // setFundTypeSelected('General');
          router.push('/secure');
        }, 3000);
      } else {
        showToast(
          'error',
          resp.message + 'else block',
          resp.errMessage ? resp.errMessage : '',
          true,
          3000,
        );
      }
      setLoading(false);
    } catch (error) {
      showToast(
        'error',
        'Could not create Fund ',
        `invalid fund type`,
        true,
        3000,
      );
    }
  };
  return (
    <>
      <Toast ref={toast} position='center' />
      <div className='flex justify-content-center align-items-center'>
        <div className='flex w-1/2 '>
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
            title='Edit  Fund'
            className='z-50 rounded-md rounded-t-none '
          >
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex items-center'>Select fund to be edited</div>
              <div>
                <Dropdown
                  value={selectedFund}
                  options={selectList}
                  onChange={onFundChange}
                  optionLabel='name'
                  placeholder='Select a fund'
                />
              </div>
            </div>
            <div>
              <form onSubmit={handleSubmit(onFundSubmit)}>
                <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }} linear>
                  <StepperPanel header='Basic Fund information'>
                    {renderFundBasic()}

                    <div className='flex pt-4 justify-content-end'>
                      <Button
                        disabled={!fundLoaded}
                        loading={isLoading}
                        label='Next'
                        icon='pi pi-arrow-right'
                        iconPos='right'
                        onClick={
                          getNextStepperStep
                          // () => stepperRef.current?.nextCallback()
                        }
                      />
                    </div>
                  </StepperPanel>
                  <StepperPanel header='Fund specific information'>
                    <div className='flex flex-column h-12rem'>
                      <div className='border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium'>
                        {renderFundDetail()}
                      </div>
                    </div>
                    <div className='flex pt-4 justify-content-between'>
                      <Button
                        label='Back'
                        severity='secondary'
                        icon='pi pi-arrow-left'
                        onClick={getPreviousStepperStep}
                      />
                      <Button
                        type='submit'
                        disabled={!isDirty}
                        severity='success'
                      >
                        Save Fund
                      </Button>
                    </div>
                  </StepperPanel>
                </Stepper>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
