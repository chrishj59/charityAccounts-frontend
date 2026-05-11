'use client';

import { Card } from 'primereact/card';
import { Toast, ToastMessage } from 'primereact/toast';

import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FundNewFormValues,
  fundNewSchema,
} from '~/src/zodSchema/fund-new-schema';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { FormEvent } from 'primereact/ts-helpers';
import { FloatLabel } from 'primereact/floatlabel';
import { fundAddAction } from '~/src/actions/company/fund/masterdata';
import { TabPanel, TabView, TabViewTabChangeEvent } from 'primereact/tabview';
import { InputSwitch } from 'primereact/inputswitch';
import { statusEnum } from '~/src/types/helper';
import { Value } from '../../../generated/prisma/runtime/library';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface props {
  userId: string;
  orgId: string;
}
export default function CreateFund({ userId, orgId }: props) {
  const toast = useRef<Toast>(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [canSave, setCanSave] = useState<boolean>(false);
  const [fundTypeSelected, setFundTypeSelected] = useState<string>('General');
  const [objective, setObjective] = useState<string>('');
  const [reviewDate, setReviewDate] = useState<Date>(new Date());
  const [projectEndDate, setProjectEndDate] = useState<Date>(new Date());
  const [nextDonarReviewDate, setNextDonarReviewDate] = useState<Date>(
    new Date(),
  );
  const [designatedDate, setDesignatedDate] = useState<Date>(new Date());
  const [returnSurplus, setReturnSurplus] = useState<boolean>(false);
  const fundDefaultValues = {
    name: '',
    donar: '',
    returnSurplus: false,
    designatedMeeting: '',
    objective: '',
    fundType: 'General',
  };
  const [activeTab, setActiveTab] = useState<number>(0);

  const {
    reset,
    setValue,
    getValues,
    trigger,
    handleSubmit,

    formState: { errors },
    control,
  } = useForm<FundNewFormValues>({
    resolver: zodResolver(fundNewSchema), // Integrate Zod for schema-based validation
    defaultValues: fundDefaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const currDate = new Date();
  const showToast = (
    severity: ToastMessage['severity'],
    summary: string,
    detail: string,
    sticky: boolean,
    life: number,
  ) => {
    toast.current?.show({ severity, summary, detail, sticky });
  };

  useEffect(() => {
    // Optionally log the error to an error reporting service
    setValue('fundType', 'General');
    setValue('reviewDate', new Date());
    setValue('projectEndDate', new Date());
    setValue('nextDonarReviewDate', new Date());
    setValue('returnSurplus', false);
    setValue('designatedDate', new Date());
    setValue('designatedMeeting', '');
  }, []);

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

  const handleFundTypeChange = (e: { value: string }) => {
    const val = e.value;

    setValue('fundType', val);
    setFundTypeSelected(val);
  };

  const getFormErrorMessage = (name: string) => {
    return (
      errors[name as keyof FundNewFormValues] && (
        <small className='p-error'>
          {errors[name as keyof FundNewFormValues]?.message}
        </small>
      )
    );
  };

  const onFundReset = () => {
    reset({
      name: '',
      donar: '',
      objective: '',
      returnSurplus: false,
      designatedMeeting: '',
      fundType: 'General',
    });
  };

  // const onObjectiveChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const objective = (e.target && e.target.value) || '';

  //   setValue('objective', objective);
  // };

  const onReviewDateChange = (e: Date) => {
    const value = e;

    (setReviewDate(value), setValue('reviewDate', value));
  };

  const onProjectEndDate = (e: Date) => {
    const value = e;
    setProjectEndDate(value);
    setValue('projectEndDate', value);
  };

  const onNextDonarReviewDate = (e: Date) => {
    const value = e;
    setNextDonarReviewDate(value);
    setValue('nextDonarReviewDate', value);
  };

  const onReturnSurplus = (e: boolean) => {
    setReturnSurplus(e);
    setValue('returnSurplus', e);
  };

  const onDesignatedDate = (e: Date) => {
    setDesignatedDate(e);
    setValue('designatedDate', e);
  };

  const handleObjectiveChange = async (e: string) => {
    setValue('objective', e);

    const valid = await trigger(['name', 'fundType', 'objective']);
    if (valid) {
      setCanSave(true);
    }
  };
  const onTabChange = async (e: TabViewTabChangeEvent) => {
    if (activeTab === 0) {
      // leaving basic info tab check fields are populated
      const valid = await trigger(['name']);

      if (!valid) {
        return;
      }
      const fundType = getValues('fundType');

      if (
        fundType === 'Income' ||
        fundType === 'Expendable' ||
        fundType === 'Permanent'
      ) {
        const donarValid = await trigger('donar');

        if (!donarValid) {
          return;
        }
      }

      if (fundType !== 'General') {
        const objectiveValid = await trigger('objective');
        if (!objectiveValid) {
          setActiveTab(0);
          return;
        }
      }
      setActiveTab(e.index);
      return;
    }
    if (activeTab === 1) {
      setActiveTab(e.index);
      return;
    }
    if (activeTab === 2) {
      const valid = await trigger(['designatedMeeting']);

      if (!valid) {
        return;
      }
      setActiveTab(e.index);
      return;
    }
    if (e.index === 2) {
      // coming to designated tab
      const valid = await trigger(['name', 'fundType', 'objective']);
      if (!valid) {
        setActiveTab(0);
      }
      setCanSave(false);
    }
  };

  const onFundSubmit = async (formData: FundNewFormValues) => {
    setLoading(true);
    const fundType = formData.fundType;

    try {
      const resp = await fundAddAction(formData, userId, orgId);

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
          setFundTypeSelected('General');
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
            title='New Fund'
            className='z-50 rounded-md rounded-t-none '
            // {
            // <div className='flex justify-content-center align-items-center text-primary'>

            // </div>
            // }
          >
            <form onSubmit={handleSubmit(onFundSubmit)}>
              <TabView
                activeIndex={activeTab}
                onTabChange={(e: TabViewTabChangeEvent) => onTabChange(e)}
              >
                <TabPanel header='Basic Information' className='flex w-1/2'>
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

                    {/* Donar line */}
                    <div className='field col-12'>
                      <Controller
                        name='donar'
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
                              <label htmlFor={field.name}>Donar</label>
                            </span>
                            {getFormErrorMessage(field.name)}
                          </>
                        )}
                      />
                    </div>

                    {/* Fund Type */}
                    <div className='field col-12'>
                      <Controller
                        name='fundType'
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
                              <Dropdown
                                id={field.name}
                                onChange={handleFundTypeChange}
                                placeholder='Select fund type'
                                value={fundTypeSelected}
                                defaultValue={fundTypes[0].name}
                                options={fundTypes}
                                optionValue='id'
                                optionLabel='description'
                                className={classNames({
                                  'p-invalid': fieldState.error,
                                })}
                              />
                              <label htmlFor={field.name}>Fund Type</label>
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
                                ) => handleObjectiveChange(e.target.value)}
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
                            e: FormEvent<
                              Date,
                              React.SyntheticEvent<Element, Event>
                            >,
                          ) => onReviewDateChange(e.value ? e.value : currDate)}
                          showIcon
                        />
                        <label htmlFor='reviewDate'>Progress Review Date</label>
                      </FloatLabel>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel header='Restricted Fund'>
                  <div className='formgrid grid  '>
                    <div className='field col-12 mt-3'>
                      {/* Project end date */}
                      <FloatLabel>
                        <Calendar
                          id='projectEndDate'
                          dateFormat='dd/M/yy'
                          value={projectEndDate}
                          minDate={new Date()}
                          onChange={(
                            e: FormEvent<
                              Date,
                              React.SyntheticEvent<Element, Event>
                            >,
                          ) => onProjectEndDate(e.value ? e.value : currDate)}
                          showIcon
                        />
                        <label htmlFor='projectEndDate'>Project End Date</label>
                      </FloatLabel>
                    </div>

                    {/* next Donar review date */}
                    <div className='field col-12 mt-3'>
                      {/* Project end date */}
                      <FloatLabel>
                        <Calendar
                          id='nextDonarReviewDate'
                          dateFormat='dd/M/yy'
                          value={nextDonarReviewDate}
                          minDate={new Date()}
                          onChange={(
                            e: FormEvent<
                              Date,
                              React.SyntheticEvent<Element, Event>
                            >,
                          ) =>
                            onNextDonarReviewDate(e.value ? e.value : currDate)
                          }
                          showIcon
                        />
                        <label htmlFor='nextDonarReviewDate'>
                          Next review with Donar due
                        </label>
                      </FloatLabel>
                    </div>

                    {/* Can trf surplus to gen fund */}
                    <div className='flex flex-col'>
                      <div>
                        <label htmlFor='returnSurplus'>
                          Return any surplus to Donar
                        </label>
                      </div>
                      <div>
                        <InputSwitch
                          id='returnSurplus'
                          checked={returnSurplus}
                          onChange={(e) => onReturnSurplus(e.value)}
                        />
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel header='Designated Fund'>
                  <div className='formgrid grid'>
                    {/* Designated date */}
                    <div className='field col-12 mt-3'>
                      {/* Project end date */}
                      <FloatLabel>
                        <Calendar
                          id='designatedDate'
                          dateFormat='dd/M/yy'
                          value={designatedDate}
                          minDate={new Date()}
                          onChange={(
                            e: FormEvent<
                              Date,
                              React.SyntheticEvent<Element, Event>
                            >,
                          ) => onDesignatedDate(e.value ? e.value : currDate)}
                          showIcon
                        />
                        <label htmlFor='designatedDate'>Date designated</label>
                      </FloatLabel>
                    </div>
                  </div>

                  {/* Designated meeting line */}
                  <div className='field col-12'>
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
                              size={50}
                              className={classNames({
                                'p-invalid': fieldState.error,
                              })}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                            <label htmlFor={field.name}>
                              Designated at meeting
                            </label>
                          </span>
                          {getFormErrorMessage(field.name)}
                        </>
                      )}
                    />
                  </div>
                </TabPanel>
              </TabView>

              <div className='flex flex-row space-x-10'>
                <div>
                  <Button type='submit' disabled={!canSave} severity='success'>
                    Save Fund
                  </Button>
                </div>
                <div className='ml-2'>
                  <Button
                    type='reset'
                    disabled={loading}
                    severity='danger'
                    onClick={() => onFundReset()}
                  >
                    Reset fund
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
