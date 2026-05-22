'use client';

import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Toast, ToastMessage } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';
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

import { FundUI } from '../../../types/ui-types/fund';
import { useClientQueries } from '@zenstackhq/tanstack-query/react';
import { schema } from '~/zenstack/schema';
import { zodResolver } from '@hookform/resolvers/zod';

interface FundListProps {
  userId: string;
  orgId: string;
  selectList: fundSelectInterface[];
}

export default function EditFund({ userId, orgId, selectList }: FundListProps) {
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
  const currDate = new Date();
  const getFormErrorMessage = (name: string) => {
    return (
      errors[name as keyof FundNewFormValues] && (
        <small className='p-error'>
          {errors[name as keyof FundNewFormValues]?.message}
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

    formState: { errors },
    control,
  } = useForm<FundNewFormValues>({
    resolver: zodResolver(fundNewSchema), // Integrate Zod for schema-based validation
    defaultValues: fundDefaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const {
    data: fundData,
    isLoading,
    isError,
  } = client.fund.useFindUnique(
    { where: { id: selectedFund?.id ?? '' } },
    { enabled: !!selectedFund?.id },
  );

  useEffect(() => {
    if (!fundData) return;

    const fundUI: FundUI = {
      id: fundData.id,
      fundName: fundData.fundName,
      objective: fundData.objective ?? undefined,
      fundType: fundData.fundType,
      // ...map remaining fields
    };

    setCurrentFund(fundUI);

    reset({
      name: fundData.fundName,
      objective: fundData.objective, //fundData.objective ?? '',
    });
  }, [fundData]);

  const onFundChange = (e: { value: fundSelectInterface }) => {
    setSelectedFund(e.value); // { id, name } — triggers useFindFirst
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
  const onFundSubmit = async (formData: FundNewFormValues) => {
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
              <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }} linear>
                <StepperPanel header='Basic Fund information'>
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
                                    onChange={(e) =>
                                      field.onChange(e.target.value)
                                    }
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
                                    ) => handleObjectiveChange(e.target.value)}
                                    //onChange={(e) => field.onChange(e.target.value)}
                                    className={classNames({
                                      'p-invalid': fieldState.error,
                                    })}
                                  />
                                  <label htmlFor={field.name}>
                                    Fund Objective
                                  </label>
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
                              ) =>
                                onReviewDateChange(e.value ? e.value : currDate)
                              }
                              showIcon
                            />
                            <label htmlFor='reviewDate'>
                              Progress Review Date
                            </label>
                          </FloatLabel>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='flex pt-4 justify-content-end'>
                    <Button
                      label='Next'
                      icon='pi pi-arrow-right'
                      iconPos='right'
                      onClick={() => stepperRef.current?.nextCallback()}
                    />
                  </div>
                </StepperPanel>
                <StepperPanel header='Fund specific information'>
                  <div className='flex flex-column h-12rem'>
                    <div className='border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium'>
                      Content II
                    </div>
                  </div>
                  <div className='flex pt-4 justify-content-between'>
                    <Button
                      label='Back'
                      severity='secondary'
                      icon='pi pi-arrow-left'
                      onClick={() => stepperRef.current?.prevCallback()}
                    />
                    <Button
                      label='Next'
                      icon='pi pi-arrow-right'
                      iconPos='right'
                      onClick={() => stepperRef.current?.nextCallback()}
                    />
                  </div>
                </StepperPanel>
              </Stepper>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
